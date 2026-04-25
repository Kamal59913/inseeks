// import express, { NextFunction, Request, Response } from "express";
// import cors from "cors";
// import { config } from "dotenv";
// import dbConnect from "./src/config/dbConnect";
// import agentRoute from "./src/routes/user/agent.route";
// import conversationRoute from "./src/routes/conversation.route";
// import contactRoute from "./src/routes/contact.route";
// import offerRouter from "./src/routes/offers/offer.route";
// import authRouter from "./src/routes/auth/auth.route";
// import cookieParser from "cookie-parser";
// import likesRoute from "./src/routes/likes.route";
// import searchRoute from "./src/routes/search.route";
// import reviewRoute from "./src/routes/ratingAndReview.route";
// import filterRoute from "./src/routes/filter.route";
// import alertRoute from "./src/routes/alert.route";
// import userVerificationRoute from "./src/routes/verification.route";
// import csvRoute from "./src/routes/download_csv.route";
// import userStatsRoute from "./src/routes/stats/userStats.route";
// import fs from "fs";
// // import paymentRoute from "./src/routes/stripePayment.route";
// import cron from "node-cron";
// import experimentRoute from "./src/routes/experiment.route";
// import propertySearchRoute from "./src/routes/propertySearch/propertySearch.route";
// import propertyRoute from "./src/routes/propertyManage/property.route"
// config();

// import bodyParser from "body-parser";

// import errorHandler from "./src/middleware/errorHandler";

// import "./src/streams/propertyWatcher";

// import CounterOfferModel from "./src/model/counterOffer.modal";
// import { sendMailOnMakeOfferBuyer } from "./src/utils/sendMailOnMakeOffer";
// import PropertyFormModel from "./src/model/property.model";
// import UserModel from "./src/model/user.model";
// import { saveSearchModel } from "./src/model/saveSearch.model";
// import OfferModel from "./src/model/offer.modal";

// const app = express();
// app.use(cookieParser());
// app.use(express.json());
// app.use(bodyParser.json());

// // Middleware to catch JSON parsing errors
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof SyntaxError && err.message.includes("Unexpected")) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid JSON syntax",
//     });
//   }
//   next();
// });

// app.use(
//   cors({
//     origin: true,
//     methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
//     allowedHeaders: "Content-Type, Authorization",
//     credentials: true,
//   })
// );


// app.use('/assets', express.static('src/assets'));

// // error handler middleware 12345
// app.use(errorHandler);

// dbConnect();

// app.use("/api/auth", authRouter);
// app.use("/api/agents", agentRoute);
// app.use("/api", conversationRoute);
// app.use("/api", contactRoute);
// app.use("/api/offer", offerRouter);
// app.use("/api/user", likesRoute);
// app.use("/api", searchRoute);
// app.use("/api", reviewRoute);
// // app.use("/api", paymentRoute);
// app.use("/api", filterRoute);
// app.use("/api", alertRoute);
// app.use("/api/download_csv", csvRoute);
// app.use("/api", userStatsRoute);
// app.use("/api/verification", userVerificationRoute);
// app.use("/experiment/123", experimentRoute);
// app.use("/api/search", propertySearchRoute);
// app.use("/api/property", propertyRoute)

// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "API working properly",
//   });
// });

// //cron-jobs
// cron.schedule("0 * * * *", async () => {
//   const now = new Date();

//   try {
//     const offers = await OfferModel.find({
//       latestStatus: 0,
//       isReplied: false,
//       expirationDate: { $lte: now },
//     });

//     if (offers.length > 0) {
//       for (const offer of offers) {
//         let newOffer = new CounterOfferModel({
//           main_offer: offer._id,
//           askingPrice: offer.askingPrice,
//           offerPrice: offer.offerPrice,
//           isReplied: offer.isReplied,
//           fundingType: offer.fundingType,
//           emdAmount: offer.emdAmount,
//           emdDueDate: offer.emdDueDate,
//           coeDate: offer.coeDate,
//           expirationDate: offer.expirationDate,
//           offer_expiration_duration: offer.offer_expiration_duration,
//           buyerId: offer.userId,
//           agentId: offer.agentId,
//           propertyId: offer.propertyId,
//           proof_of_fund: offer.proof_of_fund,
//           counteredBy: 2,
//           changedBy: 2,
//           status: 5,
//         });

//         await newOffer.save();

//         const updating = await OfferModel.findByIdAndUpdate(
//           offer._id,
//           { isReplied: true, latestStatus: 5 },
//           { new: true }
//         );

//         if (newOffer) {
//           const propertyToMail = await PropertyFormModel.findById(
//             offer?.propertyId
//           );

//           const userToFind = await UserModel.findById(offer?.userId);

//           if (userToFind && updating)
//             sendMailOnMakeOfferBuyer(userToFind.email, propertyToMail, 5, '', 1);
//         }
//       }
//     }

//     const counterOffers = await CounterOfferModel.find({
//       status: 3,
//       expirationDate: { $lte: now },
//       isReplied: false,
//     })
//       .select("-createdAt -updatedAt") // Exclude _id field
//       .lean();

//     if (counterOffers.length > 0) {
//       for (const counterOffer of counterOffers) {
//         const { _id, ...counterOfferData } = counterOffer;

//         let newCounterOffer = new CounterOfferModel({
//           ...counterOfferData, // Spread the remaining properties (without _id)
//           status: 5,
//         });

//         await newCounterOffer.save();

//         const updating = await CounterOfferModel.findByIdAndUpdate(
//           counterOffer?._id, // Use the _id of the current counterOffer in the loop
//           { isReplied: true },
//           { new: true }
//         );

//         const new_1 = await OfferModel.findByIdAndUpdate(
//           counterOffer?.main_offer,
//           {
//             isReplied: true,
//             latestStatus: 5,
//           },
//           { new: true }
//         );

//         if (newCounterOffer) {
//           const propertyToMail = await PropertyFormModel.findById(
//             counterOffer?.propertyId
//           );

//           const userToFind = await UserModel.findById(counterOffer?.buyerId);

//           if (userToFind && updating) {
//             sendMailOnMakeOfferBuyer(userToFind.email, propertyToMail, 5, '', 1);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error processing offers:", error);
//   }
// });

// // Run every hour
// // cron.schedule("*/30 * * * * *", async () => {
// // cron.schedule("0 */4 * * *", async () => {
// //   const alerts = await saveSearchModel.find({
// //     subscription: "on",
// //     alertFrequency: "instant",
// //   });

// //   const currentTime = new Date().getTime();

// //   for (const alert of alerts) {
// //     const lastAlertSent = alert.lastAlertSent || new Date(0);

// //     // Check if 4 hours (14400 seconds) have passed since the last alert was sent
// //     if (currentTime - new Date(lastAlertSent).getTime() >= 4 * 60 * 60 * 1000) {
// //       await checkAndSendAlertById(alert._id);
// //     }
// //   }
// // });

// // cron.schedule("0 0 * * *", async () => {
//   // Daily at midnight
//   // await sendSummaryEmails("daily");
// // });

// // cron.schedule("0 0 * * 0", async () => {
//   // Weekly at midnight on Sunday
//   // await sendSummaryEmails("weekly");
// // });

// /*ENDING*/
// // setupChangePropertyStream();


// app.post("/message", (req, res) => {
//   res.sendStatus(200);
// });

// function getCountryData() {
//   const data = fs.readFileSync("./src/utils/country.json", "utf-8");
//   return JSON.parse(data);
// }

// app.get("/states/:countryName", (req, res) => {
//   const { countryName } = req.params;
//   const countryData = getCountryData();
//   const country = countryData.find(
//     (country: { countryName: string }) => country.countryName === countryName
//   );

//   if (country) {
//     res.status(200).json({
//       states: country.states.map(
//         (state: { stateName: any }) => state.stateName
//       ),
//     });
//   } else {
//     res.status(404).json({ message: "Country not found" });
//   }
// });

// // API to get all cities by state name
// app.get("/cities/:stateName", (req, res) => {
//   const { stateName } = req.params;
//   const countryData = getCountryData();
//   let stateFound = false;
//   let cities: never[] = [];

//   countryData.forEach((country: { states: any[] }) => {
//     const state = country.states.find(
//       (state: { stateName: string }) => state.stateName === stateName
//     );
//     if (state) {
//       stateFound = true;
//       cities = state.cities;
//     }
//   });

//   if (stateFound) {
//     res.status(200).json({ cities });
//   } else {
//     res.status(404).json({ message: "State not found" });
//   }
// });

// // app.get("/automate", (req, res) => {
// //   monitorNewUsers;
// // });

// console.log(process.memoryUsage());
// app.listen(process.env.PORT, () => {
//   console.log(`App is running on ${process.env.PORT}`);
// });
