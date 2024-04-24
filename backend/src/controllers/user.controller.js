import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId) => 
{
     try {
          const user = await User.findById(userId)
          const accessToken = user.generateAccessToken()
          const refreshToken = user.generateRefreshToken()
          
          /*for inserting one field*/
          user.refreshToken = refreshToken
          await user.save({ validateBeforeSave: false })

          return {accessToken, refreshToken}
     } catch (error) {
          throw new ApiError(500, "Something went wrong while generating refresh and access token")
     }
}

const registerUser = asyncHandler(
    async(req, res) => {
       //get user details from front-end
       const {fullname, email, username, password} = req.body
     //   console.log("Hi", req.files[0])
       //validation - not empty
       if(
        [fullname, email, username, password].some((field) => 
            field?.trim() === "")
       ) {
          throw new ApiError(400, "fullname is required")
       }
       
       //check if user already exists: username, email
       const userExists = await User.findOne({
        $or: [{username}, {email}]
       })
       if(userExists) {
        throw new ApiError(409, "User with email or username already exists");
       }

       //upload them to cloudinary, avatar
       //create user object - create entry in db
       const user = await User.create({
            fullname,
            email,
            password,
            username: username.toLowerCase()
       })

       //remove password and refresh token field from response
       const createdUser = await User.findById(user._id)
     //   .select("-password -refreshToken")
       //check for user creation
       if(!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user")
       }
       //return res
       return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
       )
    }
)

const loginUser = asyncHandler(async (req,res) => {
     // req body -> data
     console.log("Reached Here")
     const {email, username, password} = req.body;

     //check email or username is there
     if(!(username || email)) {
          throw new ApiError(400, "username or email is required")
     }
     //find the user from email or username
     const user = await User.findOne({
          $or: [{username},{email}]
     })
     if(!user) {
          throw new ApiError(404, "User does not exist")
     }

     //password check
     const isPassWordCorrect = await user.isPassWordCorrect(password)

     if(!isPassWordCorrect){
          throw new ApiError(401, "Password is incorrect")
     }

     //access and refresh token to send to the user
     const {accessToken, refreshToken} = await
     generateAccessAndRefreshTokens(user._id)

     /*we could have used the already defined object, However querying again or updating existing object depends on the situation, how expensive the query is, here we can call again*/
     /*Optional how we want to use it*/
     const loggedInUser = await User.findById(user._id).
     select("-password -refreshToken")
     
     console.log(loggedInUser)
     //send cookie, mostly we send it using cookies
     const options = {
          httpOnly: true, /*to make cookie modifiable only in the backend, not from the front-end, cannot be from the client side*/
          secure: true,
          sameSite: 'None' //Would research later what that means
     }
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
          new ApiResponse(
               200,
               {
                    user: loggedInUser, accessToken,
                    refreshToken
               },
               "User logged In Successfully"
          )
     )
}
)

const logoutUser = asyncHandler(
     async(req, res) => {
          //How to find the User 
          await User.findByIdAndUpdate(
               req.user._id,
               {
                    $set: {
                         refreshToken: undefined
                    }
               },
               {
                    new: true //get new updated value
               }
          )
          const options = {
               httpOnly: true,
               secure: true,
               sameSite: "None"
          }

          return res
          .status(200)
          .clearCookie("accessToken", options)
          .clearCookie("refreshToken", options)
          .json(new ApiResponse(200, {}, "User Logged Out Successfully"))
     }
)

const refreshAccessToken = asyncHandler(async (req,res) => {
     //from client
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 
     if(!incomingRefreshToken) {
          throw new ApiError(401,"unauthorized request")
     }
     try {
          //verify the client's sent token with the secret key
          const decodedToken = jwt.verify(
               incomingRefreshToken,
               process.env.REFRESH_TOKEN_SECRET
          )

          //get the uid from the decoded token
          const user = User.findById(decodedToken?._id)

          if(!user) {
               throw new ApiError(401, "Invalid refresh token")
          }
     
          //checking client's refresh token with the user database refresh token
          if(incomingRefreshToken !== user?.refreshToken) {
               throw new ApiError(401, "Refresh token is expired or used")
          }
     
          //creating options
          //generate new accessToken and new RefreshToken Again using the predefined generate function
          const options = {
               httpOnly: true,
               secure: true
          }
     
          const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
     
          //return the tokens in cookies with options
          //return a json success as well
          return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", newRefreshToken, options)
          .json(
               new ApiResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
               )
          )  
     } catch (error) {
          throw new ApiError(401, error?.message ||
          "Invalid refresh token")
     } 
})

const changeCurrentPassword = asyncHandler(async (req,res) => {
     const {oldPassword, newPassword} = req.body

     const user = await User.findById(req.user?._id)
     const isPassWordCorrect = await user.isPassWordCorrect(oldPassword)

     if(!isPassWordCorrect) {
          throw new ApiError(400, "Invalid old password")
     }
     user.password = newPassword //set
     await user.save({validateBeforeSave: false}) //save

     return res
     .status(200)
     .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler( async (req,res) => {
     const user = await User.aggregate([
          //Pipeline 1
          {
               $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id)
               },
          },
          //Pipeline 2:
          //join subscriptions to User Model
          //return subscription documents that with User Id as the channel
          {
               $lookup: {
                    from: "follows", //converting to small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "channel", //channel field of Subscription
                    as: "followers", //return as subscribers
               }
          },
          //Pipeline 3:
          //returning the channels that User have subscribed to
          {
               $lookup: {
                    from: "follows", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "subscriber",
                    as: "followingTo" //return the channels subscribed to
               }
          },
          //Pipeline 4:
          //returning subscribers of the user
          {
               $lookup: {
                    from: "blogposts", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "PostAuthor",
                    as: "blogs" //return the channels subscribed to
               }
          },
          //Pipeline 5: returning the blogposts number in total
          {
               $lookup: {
                    from: "blogposts", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "PostAuthor",
                    as: "blogs" //return the channels subscribed to
               }
          },
          //Pipeline 6: returning the imageposts number in total
          {
               $lookup: {
                    from: "imageposts", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "PostAuthor",
                    as: "imageposts" //return the channels subscribed to
               }
          },
          //Pipeline 7: returning the videoposts number in total
          {
               $lookup: {
                    from: "videoposts", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "PostAuthor",
                    as: "videoposts" //return the channels subscribed to
               }
          },
          //Pipeline 8: returning subscriber's list
          {
               $lookup: {
                    from: "users",
                    localField: "followers.subscriber",
                    foreignField: "_id",
                    as: "followerslist",
                    pipeline: [{
                         $project: {
                              username: 1,
                              fullname: 1,
                              avatar: 1
                         }
                    }]
               }
          },
          //Pipeline second last: Add fields pipeline
          {
               $addFields: {
                    followersCount: {
                         $size: "$followers" //$ brings the field
                    },
                    channelsFollowedToCount: {
                         $size: "$followingTo"
                    },
                    PostsCount: {
                         $size: "$blogs"
                    },
                    ImagePostCount: {
                         $size: "$imageposts"
                    },
                    VideoPostsCount: {
                         $size: "$videoposts"
                    },
                    isFollowed: {
                         $cond: { //cond has 3 parameters if then and else
                              //in checks it in both arrays and in objects
                              if: {$in: [req.user?._id, "$followers.subscriber"]},
                              then: true,
                              else: false
                         }
                    },
               }         
          },
          //Pipeline last:
          //Will return only selected fileds
          //field: 1 selected to return 
          //Pipeline 2, 3, 4, 5, 6 are only used for the the counting purpose
          {
               $project: {
                    fullname: 1,
                    username: 1,
                    followerslist: 1,
                    followersCount: 1,
                    channelsFollowedToCount: 1,
                    isFollowed: 1,
                    PostsCount: 1,
                    ImagePostCount: 1,
                    VideoPostsCount: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1,
                    about: 1,
               }
          }
     ])
     return res
     .status(200)
     .json(new ApiResponse(200, user[0], "Here is the current user details"))
})

const updateAccountDetails = asyncHandler(async (req,res) => {
     console.log("reached here")
     const { fullname, email, username, about } = req.body
     console.log(fullname, email, username, about)
    

     const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
               $set: {
                    fullname,
                    email,
                    username,
                    about
               }
          },
          {new: true} //update hone k baad jo information hai return hota hai
          ).select("-password") 

          return res
          .status(200)
          .json(new ApiResponse(200, user, "Account details updated successfully"))
})
 
const updateAvatar = asyncHandler(async (req,res) => {
     console.log("reached here")
     const avatarLocalpath = req.file?.path

     if(!avatarLocalpath) {
          throw new ApiError(400, "Avatar file is missing")
     }

     const avatar = await uploadOnCloudinary(avatarLocalpath)

     if(!avatar.url) {
          throw new ApiError(400, "Error while uploading on avatar")
     }

     const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
               $set:{
                    avatar: avatar.url
               }
          },
          {new: true}
     ).select("-password")

     return res
     .status(200)
     .json(new ApiResponse(200, avatar.url, "avatar updated successfully"))
})

const deleteAvatar = asyncHandler(async (req,res) => {
     const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
               $unset:{
                    avatar: ""
               }
          },
          {new: true}
     ).select("-password")

     return res
     .status(200)
     .json(new ApiResponse(200, user, "avatar deleted successfully"))
})

const updateUserCoverImage = asyncHandler(async (req,res) => {
     const coverImageLocalpath = req.file?.path

     if(!coverImageLocalpath) {
          throw new ApiError(400, "Cover image file is missing")
     }

     const coverImage = await uploadOnCloudinary(coverImageLocalpath)

     if(!avatar.url) {
          throw new ApiError(400, "Error while uploading on avatar")
     }

     const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
               $set:{
                    coverImage: coverImage.url
               }
          },
          {new: true}
     ).select("-password")

     return res
     .status(200)
     .json(new ApiResponse(200, user, "Cover image updated successfully"))
})

const getauserChannelProfile = asyncHandler(async (req,res) => {
     const {username} = req.params

     if(!username?.trim()) {
          throw new ApiError(400, "username is missing")
     }

     const channel = await User.aggregate([
          //Pipeline 1
          {
               $match: {
                    username: username?.toLowerCase()
               },

          },
          //Pipeline 2:
          //join subscriptions to User Model
          //return subscription documents that with User Id as the channel
          {
               $lookup: {
                    from: "subscriptions", //converting to small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "channel", //channel field of Subscription
                    as: "subscribers" //return as subscribers
               }
          },
          //Pipeline 3:
          //returning the channels that User have subscribed to
          {
               $lookup: {
                    from: "subscriptions", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "subscriber",
                    as: "subscribedTo" //return the channels subscribed to
               }
          },
          //Pipeline 4:
          //Count the Subscribers and SUbscribed To Count
          {
               $addFields: {
                    subscribersCount: {
                         $size: "$subscribers" //$ brings the field
                    },
                    channelsSubscribedToCount: {
                         $size: "$subscribedTo"
                    },
                    isSubscribed: {
                         $cond: { //cond has 3 parameters if then and else
                              //in checks it in both arrays and in objects
                              if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                              then: true,
                              else: false
                         }
                    }
               }         
          },
          //Pipeline 5:
          //Will return only selected fileds
          //field: 1 selected to return 
          //Pipeline 2 and pipeline 3 are only used for the the counting purpose
          {
               $project: {
                    fullname: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1
               }
          }
     ])

     if(!channel?.length) {
          throw new ApiError(404, "channel does not exists")
     }

     return res
     .status(200)
     .json(
          new ApiResponse(200, channel[0], "User channel fetched successfully")
     )

})

const getWatchHistory = asyncHandler(async (req, res) => {
     //req.user._id //Interview question here we get a string and then convert
     const user = await User.aggregate([
          {
               $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id) //match with logged in user id
               }
          },
          {
               $lookup: {
                    from: "posts",
                    localField: "clickHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    //Sub Pipeline
                    pipeline: [
                         {
                            $lookup: {
                              from: "users",
                              localField: "PostAuthor",
                              foreignField: "_id",
                              as: "owner",
                              pipeline: [
                                   {
                                        $project: {
                                             fullname: 1,
                                             username: 1,
                                             avatar: 1
                                        }
                                   }
                              ]
                            }
                         },
                         {
                           $addFields: {
                              owner: {
                                   $first: "$owner"
                              }
                           }   
                         }
                    ]
               }
          }


     ])

     return res
     .status(200)
     .json(
          new ApiResponse(
               200,
               user[0].clickHistory,
               "Watch history fetched successfully"
          )
     )
})

const getanUser = asyncHandler(async (req, res) => {
     const {username} = req.params
     if(!username?.trim()) {
          throw new ApiError(400, "username is missing")
     }

     const user = await User.aggregate([
          //Pipeline 1
          {
               $match: {
                    username: username?.toLowerCase()
               },

          },
          //Pipeline 2:
          //join subscriptions to User Model
          //return subscription documents that with User Id as the channel
          {
               $lookup: {
                    from: "follows", //converting to small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "channel", //channel field of Subscription
                    as: "followers" //return as subscribers
               }
          },
          //Pipeline 3:
          //returning the channels that User have subscribed to
          {
               $lookup: {
                    from: "follows", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "subscriber",
                    as: "followingTo" //return the channels subscribed to
               }
          },
          {
               $lookup: {
                    from: "blogposts", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "PostAuthor",
                    as: "blogs" //return the channels subscribed to
               }
          },
          {
               $lookup: {
                    from: "blogposts", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "PostAuthor",
                    as: "blogs" //return the channels subscribed to
               }
          },
          {
               $lookup: {
                    from: "imageposts", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "PostAuthor",
                    as: "imageposts" //return the channels subscribed to
               }
          },
          {
               $lookup: {
                    from: "videoposts", //small case and plural
                    localField: "_id", //the User Id of User
                    foreignField: "PostAuthor",
                    as: "videoposts" //return the channels subscribed to
               }
          },
              {
               $lookup: {
                    from: "users",
                    localField: "followers.subscriber",
                    foreignField: "_id",
                    as: "followerslist",
                    pipeline: [{
                         $project: {
                              username: 1,
                              fullname: 1,
                              avatar: 1
                         }
                    }]
               }
          },
          //Pipeline 4:
          //Count the Subscribers and SUbscribed To Count
          {
               $addFields: {
                    followersCount: {
                         $size: "$followers" //$ brings the field
                    },
                    channelsFollowedToCount: {
                         $size: "$followingTo"
                    },
                    PostsCount: {
                         $size: "$blogs"
                    },
                    ImagePostCount: {
                         $size: "$imageposts"
                    },
                    VideoPostsCount: {
                         $size: "$videoposts"
                    },
                    isFollowed: {
                         $cond: { //cond has 3 parameters if then and else
                              //in checks it in both arrays and in objects
                              if: {$in: [req.user?._id, "$followers.subscriber"]},
                              then: true,
                              else: false
                         }
                    }
               }         
          },
          //Pipeline 5:
          //Will return only selected fileds
          //field: 1 selected to return 
          //Pipeline 2 and pipeline 3 are only used for the the counting purpose
          {
               $project: {
                    fullname: 1,
                    username: 1,
                    followerslist: 1,
                    followersCount: 1,
                    channelsFollowedToCount: 1,
                    isFollowed: 1,
                    PostsCount: 1,
                    ImagePostCount: 1,
                    VideoPostsCount: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1,
                    about: 1
               }
          }
     ])
     // if(!channel?.length) {
     //      throw new ApiError(404, "channel does not exists")
     // }

     return res
     .status(200)
     .json(
          new ApiResponse(200, user[0], "User channel fetched successfully")
     )

})
//route: getuserlist top 3
const getUserListThree = asyncHandler(async (req, res) => {
     const user = await User.aggregate([
          /*pipeline 1 checking followed or not*/
          {
               $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "channel",
                    as: "followingTo"
               }
          },
          /*pipeline 2 for addFields*/
          {
               $addFields: {
                    isFollowing: {
                         $cond: {
                              if: {$in: [req.user?._id, "$followingTo.subscriber"]},
                              then: true,
                              else: false
                         }
                    }
               }
          },
          /*pipeline 3 for project*/
          {
               $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                    isFollowing: 1,
                    about: 1
               }
          },
          /*pipeline 4 for limiting*/
          {
               $match: {
                    isFollowing: false
               }
          },
          /*pipeline 5 for users are supposed be only following*/
          {
               $limit: 3
          }
     ])
     return res
     .status(200)
     .json(
          new ApiResponse(200, user, "User channel fetched successfully")
     )
})

//route: friendlist
const getUserList = asyncHandler(async (req, res) => {
     const user = await User.aggregate([
          /*pipeline 1 checking followed or not*/
          {
               $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "channel",
                    as: "followingTo"
               }
          },
          /*pipeline 2 for addFields*/
          {
               $addFields: {
                    isFollowing: {
                         $cond: {
                              if: {$in: [req.user?._id, "$followingTo.subscriber"]},
                              then: true,
                              else: false
                         }
                    }
               }
          },
          /*pipeline 3 for project*/
          {
               $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                    isFollowing: 1,
                    about: 1
               }
          },

          /*pipeline 4 for users are supposed be only following*/
          {
               $match: {
                    isFollowing: true
               }
          }
     ])
     return res
     .status(200)
     .json(
          new ApiResponse(200, user, "User channel fetched successfully")
     )
})

//route: not in friendlist
const getUserListNotFriend = asyncHandler(async (req, res) => {
     const user = await User.aggregate([
          /*pipeline 1 checking followed or not*/
          {
               $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "channel",
                    as: "followingTo"
               }
          },
          /*pipeline 2 for addFields*/
          {
               $addFields: {
                    isFollowing: {
                         $cond: {
                              if: {$in: [req.user?._id, "$followingTo.subscriber"]},
                              then: true,
                              else: false
                         }
                    }
               }
          },
          /*pipeline 3 for project*/
          {
               $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                    isFollowing: 1,
                    about: 1
               }
          },

          /*pipeline 4 for users are supposed be only following*/
          {
               $match: {
                    isFollowing: false
               }
          }
     ])
     return res
     .status(200)
     .json(
          new ApiResponse(200, user, "User channel fetched successfully")
     )
})
export {
     registerUser,
     loginUser,
     logoutUser,
     refreshAccessToken,
     changeCurrentPassword,
     getCurrentUser,
     updateAccountDetails,
     updateAvatar,
     updateUserCoverImage,
     getauserChannelProfile,
     getWatchHistory,
     deleteAvatar,
     getanUser,
     getUserListThree,
     getUserList,
     getUserListNotFriend
};