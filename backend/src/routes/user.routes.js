import { Router } from "express";
import { changeCurrentPassword, 
    getCurrentUser, 
    getWatchHistory, 
    getauserChannelProfile, 
    loginUser, 
    logoutUser, 
    registerUser, 
    updateAccountDetails, 
    updateAvatar,
    deleteAvatar,
    updateUserCoverImage,
    getanUser,
    getUserListThree,
    getUserList,
    getUserListNotFriend
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middlware.js"
import { refreshAccessToken } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT ,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/updateavatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/deleteavatar").patch(verifyJWT, deleteAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, getauserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)
router.route("/profile/:username").get(verifyJWT, getanUser)
router.route("/getuserlist").get(verifyJWT, getUserListThree)
router.route("/getusers").get(verifyJWT, getUserList)
router.route("/getusersnotfollowed").get(verifyJWT, getUserListNotFriend)


export default router;  