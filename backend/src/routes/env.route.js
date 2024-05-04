import { Router } from "express";
import { CreateEnv, 
         getEnvs, 
         joinCommunity, 
         getEnvPosts,
         getEnvBlogPosts,
         getEnvImagePosts,
         getEnvVideoPosts
        } from "../controllers/env.controller.js"
import { verifyJWT } from "../middlewares/auth.middlware.js";
import { upload } from "../middlewares/multer.middleware.js"
const router = Router()

router.route("/create-env").post(verifyJWT, upload.single('envCoverImage'), CreateEnv)
router.route("/getEnvs").get(verifyJWT, getEnvs)
router.route("/create-user-join").post(verifyJWT, joinCommunity)

router.route("/getposts/env/:envname").get(verifyJWT, getEnvPosts)
router.route("/getposts/env/images/:envname").get(verifyJWT, getEnvImagePosts)
router.route("/getposts/env/videos/:envname").get(verifyJWT, getEnvVideoPosts)
router.route("/getposts/env/blogs/:envname").get(verifyJWT, getEnvBlogPosts)

export default router;