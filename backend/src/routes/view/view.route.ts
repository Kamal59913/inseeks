import { Router } from "express";
import { recordView } from "../../controller/view/view.controller";
import { auth } from "../../middleware/auth/auth.middleware";

const router = Router();

router.route("/:postId").post(auth, recordView);

export default router;
