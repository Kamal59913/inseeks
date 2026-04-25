import { messagesConstants } from "../../../utils/messages.utils.js";
import * as UserModel from "../models/user.model.js";
import * as subscriptionModel from "../models/subscription.model.js";
const { sign } = pkg;
import * as _ from "underscore";
import { getStripeSubscriptionData } from "../models/subscription.model.js";
import pkg from "jsonwebtoken";
import stripeInstance from "../../../utils/stripe.utill.js";
import getRawBody from "raw-body";
export const createProduct = async (req, res) => {
  try {
    const { name, description, metadata } = req.body;

    const product = await stripeInstance.products.create({
      name: name,
      description: description,
      metadata: metadata,
    });

    res.send({
      message: "Product created successfully",
      product: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({
      error: "Failed to create product",
    });
  }
};
export const createRecurringPrice = async (req, res) => {
  try {
    const { unitAmount, productId, interval, intervalCount, metadata } =
      req.body;

    const price = await stripeInstance.prices.create({
      unit_amount: unitAmount,
      currency: "gbp", // Set currency to GBP for the UK
      recurring: {
        interval: interval, // 'day', 'week', 'month', 'year'
        interval_count: intervalCount, // Number of intervals between each billing period
      },
      product: productId,
      metadata: metadata,
    });

    res.send({
      message: "Recurring price created successfully",
      price: price,
    });
  } catch (error) {
    console.error("Error creating recurring price:", error);
    res.status(500).send({
      error: "Failed to create recurring price",
    });
  }
};

export const productPrice = async (req, res) => {
  try {
    const prices = await stripeInstance.prices.list({
      limit: 5,
    });
    //const price = await stripe.pr;
    res.send({
      //publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      prices: prices,
    });
  } catch (error) {
    console.error("Error fetching prices:", error);
    res.status(500).send({
      error: "Failed to fetch prices",
    });
  }
};

export const createCustomers = async (req, res) => {
  try {
    // Validate required fields
    const body = {
      email: req.loggedInUser.email,
      user_id: req.loggedInUser.id,
      name: req.loggedInUser.fullName,
    };

    if (!body.email || !body.user_id) {
      return res.status(400).send({
        error: "Email and user ID are required.",
      });
    }

    const existingCustomers = await stripeInstance.customers.list({
      email: body.email,
      limit: 5,
    });
    console.log("extc", existingCustomers);

    let customer;
    if (existingCustomers.data.length > 0) {
      // Customer already exists
      customer = existingCustomers.data[0];

      // Check if the customer already has an active subscription
      const subscriptions = await stripeInstance.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });
      if (subscriptions.data.length > 0) {
        // Customer already has an active subscription, send them to biiling portal to manage subscription

        const stripeSession =
          await stripeInstance.billingPortal.sessions.create({
            customer: customer.id,
            return_url: "http://qualhon.net:3031/",
          });
        return res.status(409).json({ redirectUrl: stripeSession.url });
      }
      console.log("🚀 ~ createCustomers ~ subscriptions:", subscriptions);
    } else {
      // Create a new customer
      customer = await stripeInstance.customers.create({
        email: body.email,
        name: body.name,
        metadata: {
          userId: body.user_id,
        },
      });
    }

    // Replace this with your specific price ID
    const priceId = req.body.price_id;

    // Fetch price details from Stripe
    const price = await stripeInstance.prices.retrieve(priceId);

    const line_items = [
      {
        price: price.id,
        quantity: 1,
      },
    ];

    // Create a Setup Intent to retrieve the client_secret
    const setupIntent = await stripeInstance.setupIntents.create({
      customer: customer.id,
    });

    // Create a Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `http://qualhon.net:3031/api/v1/stripe/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://qualhon.net:3031/cancel",
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: line_items,
      metadata: {
        userId: body.user_id,
      },
      customer: customer.id,
    });

    res.json({
      url: session.url,
      client_secret: setupIntent.client_secret,
      session_id: session.id,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({
      error: "Error creating customer",
    });
  }
};

export const checkoutSession = async (req, res) => {
  try {
    // Retrieve sessionId from the request query or body
    const { sessionId } = req.query; // Adjust based on how sessionId is passed (query or body)
    console.log(sessionId);
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    // Retrieve the session from Stripe
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Payment was successful
      res.send(`
        <html>
          <head>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 120vh;
                margin: 0;
              }
              a {
                font-size: 26px;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <a href="gymmate://payment-success">Click here to continue</a>
          </body>
        </html>
      `);
    } else {
      console.log("Payment failed or is incomplete");
      // Payment failed or is incomplete
      res.send(`
        <html>
          <head>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 120vh;
                margin: 0;
              }
              a {
                font-size: 26px;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <a href="gymmate://payment-failed">Click here to retry</a>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    res.status(500).json({ error: "Error retrieving checkout session" });
  }
};

// // Placeholder function for saving the customer ID and user ID to the database
// const saveCustomerToDatabase = async (userId, customerId) => {
//   try {
//     // Replace this with your actual database logic
//     // For example, using a MongoDB collection:
//     // await db.collection('users').updateOne({ _id: userId }, { $set: { stripeCustomerId: customerId } });

//     console.log(`Saving customer ID ${customerId} for user ID ${userId} to the database`);
//   } catch (error) {
//     console.error("Error saving customer to database:", error);
//     throw new Error("Database error");
//   }
// };

export const createSubscription = async (req, res) => {
  try {
    const customerId = req.body.customer_id;

    if (!customerId) {
      return res
        .status(400)
        .send({ error: "Customer ID is missing from cookies." });
    }

    const priceId = req.body.price_id;

    if (!priceId) {
      return res
        .status(400)
        .send({ error: "Price ID is missing from request body." });
    }

    const subscription = await stripeInstance.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    res.send({
      subscription_id: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.error("Error creating subscription:", error.message);

    if (error.code === "StripeCardError") {
      // Handle specific Stripe card errors
      return res.status(402).send({ error: error.message });
    } else {
      // Handle other errors
      return res.status(500).send({ error: "Failed to create subscription." });
    }
  }
};

export const invoicePreview = async (req, res) => {
  try {
    const customerId = req.query.customer_id;
    const subscriptionId = req.query.subscription_id;
    console.log("🚀 ~ invoicePreview ~ subscriptionId:", subscriptionId);
    //const priceId = process.env[req.query.newPriceLookupKey.toUpperCase()];

    const subscription = await stripeInstance.subscriptions.retrieve(
      subscriptionId
    );

    const invoice = await stripeInstance.invoices.retrieveUpcoming({
      customer: customerId,
      subscription: subscriptionId,
      subscription_items: [
        {
          id: subscription.items.data[0].id,
          //price: priceId,
        },
      ],
    });

    res.send({ invoice });
  } catch (error) {
    console.error("Error creating subscription:", error.message);

    if (error.code === "StripeCardError") {
      // Handle specific Stripe card errors
      return res.status(402).send({ error: error.message });
    } else {
      // Handle other errors
      return res.status(500).send({ error: "Failed to get Invoice." });
    }
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscriptionId = req.body.subscription_id;

    if (!subscriptionId) {
      return res
        .status(400)
        .send({ error: { message: "Subscription ID is required." } });
    }
    console.log(subscriptionId);
    const deletedSubscription = await stripeInstance.subscriptions.cancel(
      subscriptionId
    );

    res.send({ subscription: deletedSubscription });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return res.status(500).send({
      error: {
        message: "Failed to cancel subscription. Please try again later.",
      },
    });
  }
};
export const updateSubscription = async (req, res) => {
  try {
    const { subscription_id, price_id } = req.body;

    if (!subscription_id || !price_id) {
      return res.status(400).send({
        error: {
          message: "Subscription ID and price_id are required.",
        },
      });
    }

    // Retrieve the current subscription details
    const subscription = await stripeInstance.subscriptions.retrieve(
      subscription_id
    );

    // Update the subscription with the new price
    const updatedSubscription = await stripeInstance.subscriptions.update(
      subscription_id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: price_id,
          },
        ],
      }
    );

    res.send({ subscription: updatedSubscription });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).send({
      error: {
        message: "Failed to update subscription. Please try again later.",
      },
    });
  }
};

export const getSubscription = async (req, res) => {
  try {
    // Simulate authenticated user. In practice this will be the
    // Stripe Customer ID related to the authenticated user.
    const customerId = req.query.customer_id;

    if (!customerId) {
      return res
        .status(400)
        .send({ error: { message: "Customer ID is required." } });
    }

    // Retrieve the customer's subscriptions
    const subscriptions = await stripeInstance.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    if (!subscriptions || subscriptions.data.length === 0) {
      return res.status(404).send({
        error: { message: "No subscriptions found for the customer." },
      });
    }

    // Retrieve the customer details
    const customer = await stripeInstance.customers.retrieve(customerId);

    res.json({ subscriptions: subscriptions.data, customer: customer });
  } catch (error) {
    console.error("Error retrieving subscriptions or customer details:", error);
    res.status(500).send({
      error: {
        message: "Error retrieving subscriptions or customer details.",
      },
    });
  }
};

export const getSubscriptionById = async (req, res) => {
  try {
    const subscriptionId = req.query.subscription_id;

    if (!subscriptionId) {
      return res
        .status(400)
        .send({ error: { message: "Subscription ID is required." } });
    }

    // Retrieve the subscription
    const subscription = await stripeInstance.subscriptions.retrieve(
      subscriptionId
    );

    if (!subscription) {
      return res
        .status(404)
        .send({ error: { message: "Subscription not found." } });
    }

    // Retrieve the customer associated with the subscription
    const customer = await stripeInstance.customers.retrieve(
      subscription.customer
    );

    res.send({ subscription: subscription, customer: customer });
  } catch (error) {
    console.error("Error retrieving subscription or customer:", error);
    res.status(500).send({
      error: { message: "Error retrieving subscription or customer" },
    });
  }
};

// webhook

// export const webhooks = async (req, res) => {
//   // Retrieve the event by verifying the signature using the raw body and secret.
//   let event;
//   console.log(process.env.STRIPE_WEBHOOK_SECRET);
//   try {
//     event = stripeInstance.webhooks.constructEvent(
//       req.body,
//       req.header("Stripe-Signature"),
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.log(err);
//     console.log(`⚠️  Webhook signature verification failed.`);
//     console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
//     return res.sendStatus(400);
//   }
//   console.log(event);
//   // Extract the object from the event.
//   const dataObject = event.data.object;

//   // Handle the event
//   // Review important events for Billing webhooks
//   // https://stripe.com/docs/billing/webhooks
//   // Remove comment to see the various objects sent for this sample
//   switch (event.type) {
//     case "invoice.payment_succeeded":
//       if (dataObject["billing_reason"] === "subscription_create") {
//         // The subscription automatically activates after successful payment
//         // Set the payment method used to pay the first invoice
//         // as the default payment method for that subscription
//         const subscription_id = dataObject["subscription"];
//         const payment_intent_id = dataObject["payment_intent"];
//         const subscriptionDocument = {
//           userId: customer?.metadata?.userId,
//           subId: event.data.object.subscription,
//           endDate: subscription.current_period_end * 1000,
//         };
//         // Retrieve the payment intent used to pay the subscription
//         const payment_intent = await stripeInstance.paymentIntents.retrieve(
//           payment_intent_id
//         );
//         console.log("paymentstatus", payment_intent);
//         try {
//           const subscription = await stripeInstance.subscriptions.update(
//             subscription_id,
//             {
//               default_payment_method: payment_intent.payment_method,
//             }
//           );
//           console.log("subscription", subscription);
//           console.log(
//             "Default payment method set for subscription:" +
//               payment_intent.payment_method
//           );
//         } catch (err) {
//           console.log(err);
//           console.log(
//             `⚠️  Failed to update the default payment method for subscription: ${subscription_id}`
//           );
//         }
//       }
//       break;
//     case "invoice.payment_failed":
//       // If the payment fails or the customer does not have a valid payment method,
//       // an invoice.payment_failed event is sent, the subscription becomes past_due.
//       // Use this webhook to notify your user that their payment has
//       // failed and to retrieve new card details.
//       break;
//     case "invoice.finalized":
//       // If you want to manually send out invoices to your customers
//       // or store them locally to reference to avoid hitting Stripe rate limits.
//       break;
//     case "customer.subscription.deleted":
//       if (event.request != null) {
//         // handle a subscription cancelled by your request
//         // from above.
//       } else {
//         // handle subscription cancelled automatically based
//         // upon your subscription settings.
//       }
//       break;
//     case "customer.subscription.trial_will_end":
//       // Send notification to your user that the trial will end
//       break;
//     default:
//     // Unexpected event type
//   }
//   console.log(send);
//   res.sendStatus(200);
// };

export const webhook = async (req, res) => {
  let event;
  const payload = Buffer.from(JSON.stringify(req.body), "utf8");
  const sig = req.headers["stripe-signature"];
  //const rawBody = await getRawBody(req.body);

  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    const header = stripeInstance.webhooks.generateTestHeaderString({
      payload: payload,
      secret,
    });
    event = stripeInstance.webhooks.constructEvent(payload, header, secret);
  } catch (err) {
    console.log(err);
    console.log(`⚠️  Webhook signature verification failed.`);
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
    return res.sendStatus(400);
  }
  //console.log("event>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", event);
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;

    // On payment successful, get subscription and customer details
    const subscription = await stripeInstance.subscriptions.retrieve(
      event.data.object.subscription
    );
    const customer = await stripeInstance.customers.retrieve(
      event.data.object.customer
    );

    //   console.log(subscription,customer);

    if (invoice.billing_reason === "subscription_create") {
      // Handle the first successful payment
      // DB code to update the database for first subscription payment

      const subscriptionDocument = {
        userId: customer?.metadata?.userId,
        subId: event.data.object.subscription,
        endDate: subscription.current_period_end * 1000,
        recurring_payment: null,
      };

      // // Insert the document into the collection
      const result = await subscriptionModel.saveSubscription(
        subscriptionDocument
      );
      if (result.affectedRows == 1) {
        let status = 1;
        await UserModel.changePremiumStatus(
          subscriptionDocument.userId,
          status
        );
      }

      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      console.log(
        `First subscription payment successful for Invoice ID: ${customer.email} ${customer?.metadata?.userId}`
      );
    } else if (
      invoice.billing_reason === "subscription_cycle" ||
      invoice.billing_reason === "subscription_update"
    ) {
      // Handle recurring subscription payments
      // DB code to update the database for recurring subscription payments

      // Define the filter to find the document with the specified userId
      const filter = { userId: customer?.metadata?.userId };

      // Define the update operation to set the new endDate
      // const updateDoc = {
      //   $set: {
      //     endDate: subscription.current_period_end * 1000,
      //     recurringSuccessful_test: true,
      //   },
      // };

      // const updateDoc = {
      //   userId: userId,
      //   endDate: subscription.current_period_end * 1000,
      //   recurring_payment: true,
      // };
      // // Update the document
      // const result = await subscriptionModel.saveSubscription(updateDoc);

      if (result.matchedCount === 0) {
        console.log("No documents matched the query. Document not updated");
      } else if (result.modifiedCount === 0) {
        console.log(
          "Document matched but not updated (it may have the same data)"
        );
      } else {
        console.log(`Successfully updated the document`);
      }
    }
  }
  //console.log(event.type, "evettype>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  // For canceled/renewed subscription
  if (event.type === "customer.subscription.updated") {
    const customer = await stripeInstance.customers.retrieve(
      event.data.object.customer
    );
    //console.log(customer, "custmer");

    const subscription = event.data.object;

    if (
      subscription.cancel_at_period_end ||
      subscription.status === "canceled"
    ) {
      console.log(`Subscription ${subscription.id} was canceled.`);
      const updateDoc = {
        userId: customer?.metadata?.userId,
        subId: subscription.id,
      };
      // DB code to update the customer's subscription status in your database
      const result = await subscriptionModel.deleteSubscription(updateDoc);
      let status = 0;
      await UserModel.changePremiumStatus(updateDoc.userId, status);
      let data = await UserModel.getUserById(updateDoc.userId);
    } else {
      const updateDoc = {
        userId: customer?.metadata?.userId,
        subId: subscription.id,
        endDate: subscription.current_period_end * 1000,
        recurring_payment: true,
      };
      // Update the documents
      const result = await subscriptionModel.updateSubscription(updateDoc);
      let status = 1;

      await UserModel.changePremiumStatus(updateDoc.userId, status);

      console.log(`Subscription ${subscription.id} was restarted.`);
      // get subscription details and update the DB
    }
  }

  res.status(200).end();
};

// export const webhook = async (req, res) => {
//   let event;
//   const payload = Buffer.from(JSON.stringify(req.body), "utf8");
//   const sig = req.headers["stripe-signature"];
//   // console.log(req);
//   try {
//     const secret = process.env.STRIPE_WEBHOOK_SECRET;

//     const header = stripeInstance.webhooks.generateTestHeaderString({
//       payload: payload,
//       secret,
//     });
//     event = stripeInstance.webhooks.constructEvent(payload, header, secret);
//   } catch (err) {
//     console.error(`Webhook Error: ${err.message}`);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
//   console.log("jfhgfjieui>>>>>>>>>>>>>>>>>>>>>>>>>>>", event);
//   try {
//     if (event.type === "invoice.payment_succeeded") {
//       const invoice = event.data.object;

//       // On payment successful, get subscription and customer details
//       const subscription = await stripeInstance.subscriptions.retrieve(
//         event.data.object.subscription
//       );
//       const customer = await stripe.customers.retrieve(
//         event.data.object.customer
//       );

//       if (invoice.billing_reason === "subscription_create") {
//         // Handle the first successful payment
//         const subscriptionDocument = {
//           userId: customer.metadata.userId,
//           subId: event.data.object.subscription,
//           endDate: subscription.current_period_end * 1000,
//         };

//         // Connect to MongoDB
//         await client.connect();
//         const database = client.db("your-database-name");
//         const subscriptions = database.collection("your-collection-name");

//         // Insert the document into the collection
//         const result = await subscriptions.insertOne(subscriptionDocument);
//         console.log(
//           `A document was inserted with the _id: ${result.insertedId}`
//         );
//         console.log(
//           `First subscription payment successful for Invoice ID: ${customer.email} ${customer.metadata.userId}`
//         );
//       } else if (
//         invoice.billing_reason === "subscription_cycle" ||
//         invoice.billing_reason === "subscription_update"
//       ) {
//         // Handle recurring subscription payments
//         const filter = { userId: customer.metadata.userId };
//         const updateDoc = {
//           $set: {
//             endDate: subscription.current_period_end * 1000,
//             recurringSuccessful_test: true,
//           },
//         };

//         // Update the document
//         const result = await subscriptions.updateOne(filter, updateDoc);

//         if (result.matchedCount === 0) {
//           console.log("No documents matched the query. Document not updated");
//         } else if (result.modifiedCount === 0) {
//           console.log(
//             "Document matched but not updated (it may have the same data)"
//           );
//         } else {
//           console.log(`Successfully updated the document`);
//         }

//         console.log(
//           `Recurring subscription payment successful for Invoice ID: ${invoice.id}`
//         );
//       }

//       console.log(
//         new Date(subscription.current_period_end * 1000),
//         subscription.status,
//         invoice.billing_reason
//       );
//     }

//     // For canceled/renewed subscription
//     if (event.type === "customer.subscription.updated") {
//       const subscription = event.data.object;
//       if (subscription.cancel_at_period_end) {
//         console.log(`Subscription ${subscription.id} was canceled.`);
//         // Handle cancellation in your database
//       } else {
//         console.log(`Subscription ${subscription.id} was restarted.`);
//         // Handle restart in your database
//       }
//     }
//   } catch (err) {
//     console.error(`Error processing webhook event: ${err.message}`);
//     return res
//       .status(500)
//       .send(`Error processing webhook event: ${err.message}`);
//   } finally {
//     // Close the MongoDB connection
//     await client.close();
//   }

//   res.status(200).end();
// };

export const hasPremiumUser = async (req, res) => {
  try {
    const user_id = req.loggedInUser.id;
    let data = await UserModel.getUserById(user_id);
    if (!data) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    let userID = [
      {
        user_id: data.id,
      },
    ];
    const pic = (await UserModel.getAllMedia(userID))[0];

    data.profile_image = pic.images[0];
    const has_premium = data.has_premium === 1;
    const jsonToken = sign({ user: data }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    const is_set_pin = data.is_set_pin == 1;
    let subscription_data = await getStripeSubscriptionData(data.id);
    data = {
      ..._.omit(
        data,
        "image",
        "first_name",
        "last_name",
        "has_premium",
        "phone_number",
        "token_expired_at",
        "user_ip",
        "created_at",
        "updated_at",
        "deleted_at",
        "password",
        "last_login_at",
        "password_reset_token",
        "created_by",
        "deleted_by",
        "isApprove",
        "is_deleted",
        "is_set_pin"
      ),

      has_premium,
      profile_image: data.profile_image || {
        media_type: null,
        media_ext: "",
        media_url: "",
        media_id: null,
      },
      is_set_pin,
      subscription_id: subscription_data
        ? subscription_data.subscription_id
        : null,
      access_token: jsonToken,
    };
    return res.status(200).json({
      message: "success",

      response: data,
    });
  } catch (error) {
    console.log(error);
  }
};
