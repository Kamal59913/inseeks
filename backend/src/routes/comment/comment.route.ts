import { Router } from "express";
import { createComment, retrieveComment } from "../../controller/comment/comment.controller";
import { auth } from "../../middleware/auth/auth.middleware";
import { upload } from "../../middleware/upload/upload.middleware";

const router = Router()

router.route("/post-comment").post(auth, upload.array("attachments", 4), createComment)
router.route("/retrieve-comment").post(auth, retrieveComment)

export default router;
