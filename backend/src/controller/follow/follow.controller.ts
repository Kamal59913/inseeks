// @ts-nocheck
import { asyncHandler } from "../../utils/response/asyncHandler";
import { Follow } from "../../model/follow.model.js";
import { ApiResponse } from "../../utils/response/ApiResponse";

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
