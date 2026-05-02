import { Router } from "express";
import { CreateEnv, 
         getEnvs, 
         joinCommunity, 
         getEnvPosts,
         getEnvBlogPosts,
         getEnvImagePosts,
         getEnvVideoPosts,
         deleteEnv,
         updateEnv
        } from "../../controller/env/env.controller"
import { auth } from "../../middleware/auth/auth.middleware";
import { upload } from "../../middleware/upload/upload.middleware"
const router = Router()

router.route("/create-env").post(auth, upload.single('envCoverImage'), CreateEnv)
router.route("/getEnvs").get(auth, getEnvs)
router.route("/create-user-join").post(auth, joinCommunity)

router.route("/getposts/env/:envname").get(auth, getEnvPosts)
router.route("/getposts/env/images/:envname").get(auth, getEnvImagePosts)
router.route("/getposts/env/videos/:envname").get(auth, getEnvVideoPosts)
router.route("/getposts/env/blogs/:envname").get(auth, getEnvBlogPosts)

/* space edit / delete */
router.route("/:envname").delete(auth, deleteEnv)
router.route("/:envname").patch(auth, upload.single('envCoverImage'), updateEnv)

export default router;
