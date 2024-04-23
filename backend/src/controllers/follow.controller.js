import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Follow } from "../models/follow.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const requestFollow = asyncHandler(async (req,res) => {
     const { userId } = req.body;
     
     let follow;
     {
     const checkif = await Follow.find({
          subscriber: req.user._id,
          channel: userId
     })

     if(checkif.length === 0) {
          follow = await Follow.create({
               subscriber: req.user._id,
               channel: userId
          })
     } else {
          follow = await Follow.findOneAndDelete({
               subscriber: req.user._id,
               channel: userId,
          })
     }

     }
     return res
     .status(200)
     .json(
          new ApiResponse(200, follow, "User subscription is done successfully")
     )
})

const toggleFollow = asyncHandler(async (req,res) => {
     const { userId, toggle } = req.body;
     console.log("reached here", userId, toggle)
     let follow;
     {
     const checkif = await Follow.find({
          subscriber: req.user._id,
          channel: userId
     })

     if(checkif.length === 0 && toggle == 'connected') {
          follow = await Follow.create({
               subscriber: req.user._id,
               channel: userId
          })
     } else {
          follow = await Follow.findOneAndDelete({
               subscriber: req.user._id,
               channel: userId,
          })
     }
     }
     return res
     .status(200)
     .json(
          new ApiResponse(200, follow, "User subscription is done successfully")
     )
})
export {
     requestFollow,
     toggleFollow
};