// @ts-nocheck
import { asyncHandler } from "../../utils/response/asyncHandler";
import { ApiResponse } from "../../utils/response/ApiResponse";
import { Likes } from "../../model/likes.model.js";
import mongoose from "mongoose";

const LikePost = asyncHandler(async (req,res) => {
     const {PostId, type} = req.body

     let find;

     let likedPost;

     // Check if the like already exists
     if (type === 'image' || type === 'video' || type === 'blogpost') {
         likedPost = await Likes.findOne({
             [type]: PostId,
             likedBy: req.user._id
         });
     }

     if(likedPost) {
          await Likes.findByIdAndDelete(likedPost._id)
     }

     if (!likedPost) {
          {
               if(type == 'image') {
                    find = await Likes.create({
                         image : PostId,
                         likedBy: req.user._id,
                    })
               }
               else if(type == 'video') {
                    find = await Likes.create({
                         video : PostId,
                         likedBy: req.user._id,
                    })
               }         
               else if(type == 'blogpost') {
                    find = await Likes.create({
                         blogpost : PostId,
                         likedBy: req.user._id,
                    })
               }
     
          }

     } 

     return res
     .status(200)
     .json(
          new ApiResponse(200, find, "Successfully liked the post")
     )
})

const GetPostLike = asyncHandler(async (req,res) => {

     const {PostId, type} = req.body

     let matchField;
     
     if (type === 'image') matchField = 'image';
     else if (type === 'video') matchField = '$video';
     else if (type === 'blogpost') matchField = '$blogpost';
     else matchField = null; // Handle other types if needed
 
     
     const likedetails = await Likes.aggregate([
          /*pipeline 1 to match specific genre of post*/
          {
               $match: {
                    [type]: new mongoose.Types.ObjectId(PostId)
               }
          },

          /*pipeline 2 to check if the post is liked by the current user*/
          {
               $addFields: {
                    isLiked: {
                         $cond: {
                              if: {$eq: [req.user?._id, "$likedBy"]},
                              then: true,
                              else: false
                         }
                    },                          
               }
          },
     ])
     
     return res
     .status(200)
     .json(
          new ApiResponse(200, likedetails, "Successfully retrieved like details")
     )
})



export {
    LikePost,
    GetPostLike
};
