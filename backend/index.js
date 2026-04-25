"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const dbConnect_ts_1 = __importDefault(require("./src/config/dbConnect.ts"));
// import mailSender from "./src/utils/mailSender.js";
const agent_route_ts_1 = __importDefault(require("./src/routes/agent.route.ts"));
const message_route_ts_1 = __importDefault(require("./src/routes/message.route.ts"));
const contact_route_ts_1 = __importDefault(require("./src/routes/contact.route.ts"));
const offer_route_ts_1 = __importDefault(require("./src/routes/offer.route.ts"));
const auth_route_ts_1 = __importDefault(require("./src/routes/auth.route.ts"));
// import {
//   getCompanyAccessToken,
//   getCompanyAuthorizationCode,
// } from "./src/utils/companyAutomation.ts";
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const likes_route_ts_1 = __importDefault(require("./src/routes/likes.route.ts"));
const search_route_ts_1 = __importDefault(require("./src/routes/search.route.ts"));
const ratingAndReview_route_ts_1 = __importDefault(require("./src/routes/ratingAndReview.route.ts"));
const filter_route_ts_1 = __importDefault(require("./src/routes/filter.route.ts"));
const alert_route_ts_1 = __importDefault(require("./src/routes/alert.route.ts"));
const fs_1 = __importDefault(require("fs"));
// import { monitorNewUsers } from "./src/utils/addContactAutomation.ts";
const stripePayment_route_ts_1 = __importDefault(require("./src/routes/stripePayment.route.ts"));
const node_cron_1 = __importDefault(require("node-cron"));
const saveSearch_model_ts_1 = require("./src/model/saveSearch.model.ts");
const saveSearch_controller_ts_1 = require("./src/controller/saveSearch.controller.ts");
(0, dotenv_1.config)();
const body_parser_1 = __importDefault(require("body-parser"));
const errorHandler_ts_1 = __importDefault(require("./src/middleware/errorHandler.ts"));
const addContactAutomation_ts_1 = require("./src/utils/addContactAutomation.ts");
const socialMarketingPropery_ts_1 = require("./src/utils/socialMarketingPropery.ts");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// Middleware to catch JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.message.includes("Unexpected")) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON syntax",
        });
    }
    next();
});
app.use((0, cors_1.default)({
    origin: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
}));
// error handler middleware
app.use(errorHandler_ts_1.default);
(0, dbConnect_ts_1.default)();
app.use("/api/auth", auth_route_ts_1.default);
app.use("/api/agents", agent_route_ts_1.default);
app.use("/api", message_route_ts_1.default);
app.use("/api", contact_route_ts_1.default);
app.use("/api/offer", offer_route_ts_1.default);
app.use("/api/user", likes_route_ts_1.default);
app.use("/api", search_route_ts_1.default);
app.use("/api", ratingAndReview_route_ts_1.default);
app.use("/api", stripePayment_route_ts_1.default);
app.use("/api", filter_route_ts_1.default);
app.use("/api", alert_route_ts_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "API working properly",
    });
});
//cron-jobs
// Run every hour
node_cron_1.default.schedule("0 */4 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const alerts = yield saveSearch_model_ts_1.saveSearchModel.find({
        subscription: "on",
        alertFrequency: "instant",
    });
    const currentTime = new Date().getTime();
    for (const alert of alerts) {
        const lastAlertSent = alert.lastAlertSent || new Date(0);
        // Check if 4 hours (14400 seconds) have passed since the last alert was sent
        if (currentTime - new Date(lastAlertSent).getTime() >= 4 * 60 * 60 * 1000) {
            yield (0, saveSearch_controller_ts_1.checkAndSendAlertById)(alert._id);
        }
    }
}));
node_cron_1.default.schedule("0 */10 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, addContactAutomation_ts_1.getAllAgents)();
}));
// Hi 123
(0, addContactAutomation_ts_1.setupChangeStream)();
(0, socialMarketingPropery_ts_1.setupChangePropertyStream)();
// Endpoint to receive messages from GoHighLevel
app.post("/message", (req, res) => {
    // Here, you can process the message and send a response if needed
    // For now, just acknowledge the receipt
    res.sendStatus(200);
});
// automate sync from database
// Route to send a normal email
// app.post("/send-email", async (req, res) => {
//   const { to, subject, text } = req.body;
//   try {
//     const response = await mailSender(to, subject, text);
//     res.status(200).json({ message: "Email sent successfully", response });
//   } catch (error) {
//     res.status(500).json({ message: "Error sending email", error });
//   }
// });
// app.post("/testing/v1", async (req, res) => {
//   // const location = req.body.locationId;
//   try {
//     //const { access_token } = await getLocationToken(location);
//     const companyTokenData = await getCompanyAccessToken();
//     console.log(companyTokenData);
//     // console.log(access_token);
//     // res.json(access_token);
//   } catch (error: any) {
//     console.error(error.message);
//     res.status(500).send(error.message);
//   }
// });
function getCountryData() {
    const data = fs_1.default.readFileSync("./src/utils/country.json", "utf-8");
    return JSON.parse(data);
}
// API to get all states by country name
app.get("/states/:countryName", (req, res) => {
    const { countryName } = req.params;
    const countryData = getCountryData();
    const country = countryData.find((country) => country.countryName === countryName);
    if (country) {
        res.status(200).json({
            states: country.states.map((state) => state.stateName),
        });
    }
    else {
        res.status(404).json({ message: "Country not found" });
    }
});
// API to get all cities by state name
app.get("/cities/:stateName", (req, res) => {
    const { stateName } = req.params;
    const countryData = getCountryData();
    let stateFound = false;
    let cities = [];
    countryData.forEach((country) => {
        const state = country.states.find((state) => state.stateName === stateName);
        if (state) {
            stateFound = true;
            cities = state.cities;
        }
    });
    if (stateFound) {
        res.status(200).json({ cities });
    }
    else {
        res.status(404).json({ message: "State not found" });
    }
});
// app.get("/automate", (req, res) => {
//   monitorNewUsers;
// });
console.log(process.memoryUsage());
app.listen(process.env.PORT, () => {
    console.log(`App is running on ${process.env.PORT}`);
});
