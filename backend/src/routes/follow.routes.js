import { Router } from "express";
import { requestFollow, toggleFollow } from "../controllers/follow.controller.js";
import { verifyJWT } from "../middlewares/auth.middlware.js";

const router = Router()

//api/v1/follow//user/connect
router.route("/user/connect").post(verifyJWT, requestFollow)
router.route("/user/connecttoggle").post(verifyJWT, toggleFollow)

export default router;