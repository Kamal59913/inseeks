import { Router } from "express";
import { requestFollow, toggleFollow } from "../../controller/follow/follow.controller";
import { auth } from "../../middleware/auth/auth.middleware";

const router = Router()

//api/v1/follow//user/connect
router.route("/user/connect").post(auth, requestFollow)
router.route("/user/connecttoggle").post(auth, toggleFollow)

export default router;
