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
        } from "../../controller/createpost/createpost.controller";
import { upload } from "../../middleware/upload/upload.middleware";
import { auth } from "../../middleware/auth/auth.middleware";

const router = Router()

router.route("/generalpost").post(auth, 
    upload.single("image"),
    createPost)
router.route("/videopost").post(auth, 
    upload.single("video"),
    createVideoPost)
router.route("/imagepost").post(auth, 
    upload.array("images"),
    createImagePost)
router.route("/getposts/h").post(auth, homePagePostsDisplay)
router.route("/getposts/h/images").post(auth, imagesDisplay)
router.route("/getposts/h/videos").post(auth, videosDisplay)
router.route("/getposts/h/blogs").post(auth, blogsDisplay)

/*user profile display*/
router.route("/getalluserposts/:username").get(auth, getUsersPosts)
router.route("/getuserposts/images/:username").get(auth, getUserimagesDisplay)
router.route("/getuserposts/videos/:username").get(auth, getUserVideosDisplay)
router.route("/getuserposts/blogs/:username").get(auth, getUserblogsDisplay)

export default router;
