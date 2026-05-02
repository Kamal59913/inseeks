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
    getUserListNotFriend,
    forgotPassword,
    verifyOTP,
    resetPassword
} from "../../controller/user/user.controller";
import { upload } from "../../middleware/upload/upload.middleware";
import { auth } from "../../middleware/auth/auth.middleware";
import { refreshAccessToken } from "../../controller/user/user.controller";

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
router.route("/forgot-password").post(forgotPassword)
router.route("/verify-otp").post(verifyOTP)
router.route("/reset-password").post(resetPassword)
//secured routes
router.route("/logout").post(auth ,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(auth, changeCurrentPassword)
router.route("/current-user").get(auth, getCurrentUser)
router.route("/update-account").patch(auth, updateAccountDetails)
router.route("/updateavatar").patch(auth, upload.single("avatar"), updateAvatar)
router.route("/deleteavatar").patch(auth, deleteAvatar)
router.route("/cover-image").patch(auth, upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(auth, getauserChannelProfile)
router.route("/history").get(auth, getWatchHistory)
router.route("/profile/:username").get(auth, getanUser)
router.route("/getuserlist").get(auth, getUserListThree)
router.route("/getusers").get(auth, getUserList)
router.route("/getusersnotfollowed").get(auth, getUserListNotFriend)


export default router;  
