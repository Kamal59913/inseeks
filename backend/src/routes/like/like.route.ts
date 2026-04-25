import { Router } from "express";
import { LikePost, GetPostLike } from "../../controller/like/like.controller";
import { auth } from "../../middleware/auth/auth.middleware";

const router = Router()

router.route("/toggle/like").post(auth, LikePost)
router.route("/getlike").post(auth, GetPostLike)


export default router;
