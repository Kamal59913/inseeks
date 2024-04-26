import { Router } from "express";
import { CreateEnv } from "../controllers/env.controller.js"
import { verifyJWT } from "../middlewares/auth.middlware.js";
import { upload } from "../middlewares/multer.middleware.js"
const router = Router()

router.route("/create-env").post(verifyJWT, upload.single('envCoverImage'), CreateEnv)

export default router;