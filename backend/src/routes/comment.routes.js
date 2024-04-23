import { Router } from "express";
import { createComment, retrieveComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middlware.js";

const router = Router()

router.route("/post-comment").post(verifyJWT, createComment)
router.route("/retrieve-comment").post(verifyJWT, retrieveComment)

export default router;