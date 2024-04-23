import { Router } from "express";
import { createPost, 
         createVideoPost, 
         createImagePost, 
         homePagePostsDisplay,
         videosDisplay,
         imagesDisplay,
         blogsDisplay,
         getUsersPosts,
         getUserimagesDisplay,
         getUserVideosDisplay,
         getUserblogsDisplay
        } from "../controllers/createpost.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlware.js";

const router = Router()

router.route("/generalpost").post(verifyJWT, 
    upload.single("image"),
    createPost)
router.route("/videopost").post(verifyJWT, 
    upload.single("video"),
    createVideoPost)
router.route("/imagepost").post(verifyJWT, 
    upload.array("images"),
    createImagePost)
router.route("/getposts/h").post(verifyJWT, homePagePostsDisplay)
router.route("/getposts/h/images").post(verifyJWT, imagesDisplay)
router.route("/getposts/h/videos").post(verifyJWT, videosDisplay)
router.route("/getposts/h/blogs").post(verifyJWT, blogsDisplay)

/*user profile display*/
router.route("/getalluserposts/:username").get(verifyJWT, getUsersPosts)
router.route("/getuserposts/images/:username").get(verifyJWT, getUserimagesDisplay)
router.route("/getuserposts/videos/:username").get(verifyJWT, getUserVideosDisplay)
router.route("/getuserposts/blogs/:username").get(verifyJWT, getUserblogsDisplay)

export default router;