import { Router } from "express";
import { LikePost, GetPostLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middlware.js";

const router = Router()

router.route("/toggle/like").post(verifyJWT, LikePost)
router.route("/getlike").post(verifyJWT, GetPostLike)


export default router;