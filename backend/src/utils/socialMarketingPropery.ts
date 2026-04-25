import UserModel from "../model/user.model";
import mongoose from "mongoose";
import PropertyFormModel from "../model/property.model";
import sendMailOnProperty from "./sendMailOnProperty";
import twilio from "twilio";

const sendSMS = async (phone_number: string, messageBody: string) => {
  try {
    const client = twilio(
      process.env.TWILLIO_ACCOUNTS_ID,
      process.env.TWILLIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
      body: messageBody,
      messagingServiceSid: process.env.TWILLIO_MESSAGING_SERVICE_SID,
      to: phone_number,
    });

    console.log(`SMS sent: ${message.sid}`);
  } catch (error) {
    console.error(`Error sending SMS to ${phone_number}:`, error);
  }
};

const processEmailCampaign = async (property: any) => {
  try {
    const users = await UserModel.find();

    users.forEach((user) => {
      // Sending email notifications
      if (user.email && property) {
        sendMailOnProperty(user.email, property)
          .then(() => {
            console.log(`Email sent to ${user.email}`);
          })
          .catch((error) => {
            console.error(`Error sending email to ${user.email}:`, error);
          });
      }

      // Sending SMS notifications
      if (user.phone && property) {
        const messageBody = `
                    🏡 New Property Alert! 🏡
                    ${property.badge} 🎉
                    Property: ${property.desc_title} 🏠 
                    Description: ${property.desc_detail}
                    Price: $${property.price}
                    Location: ${property.county}, ${property.state}, ${property.postal_code} 📍
                    Beds: ${property.bedrooms} 🛏️ ,Baths: ${property.bathrooms} 🛁, Size: ${property.size} Sqft
                    📞 Contact us at + 91 xxxxx-xxxxx
                    For more details or visit us at: ${process.env.ACCESS_URL}/property-details/${property._id} 🔗
                    Thank you!`;

        sendSMS(user.phone, messageBody)
          .then(() => {
            console.log(`SMS sent to ${user.phone}`);
          })
          .catch((error) => {
            console.error(`Error sending SMS to ${user.phone}:`, error);
          });
      }
    });
  } catch (error) {
    console.error("Error processing email campaign:", error);
  }
};

const setupChangePropertyStream = async () => {
  const db = mongoose.connection;

  db.once("open", () => {
    const changeStream = PropertyFormModel.watch();

    changeStream.on("change", (change) => {
      // Check for the update operation
      if (change.operationType === "update") {
        const updatedFields = change.updateDescription.updatedFields;

        // Check if publishing_status is modified
        if (updatedFields.hasOwnProperty("publishing_status")) {
          const propertyId = change.documentKey._id;
          // Fetch the updated document using the propertyId
          PropertyFormModel.findById(propertyId)
            .then((updatedDocument) => {
              if (updatedDocument) {
                processEmailCampaign(updatedDocument);
              }
            })
            .catch((error) => {
              console.error("Error fetching updated document:", error);
            });
        }
      }
    });
  });
};

export { setupChangePropertyStream };
