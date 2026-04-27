// @ts-nocheck
import { asyncHandler } from "../../utils/response/asyncHandler";
import { ApiResponse } from "../../utils/response/ApiResponse";
import { Env } from "../../model/env.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiError } from "../../utils/response/ApiError";
import { Joins } from "../../model/joins.model.js";
import { BlogPost } from "../../model/blogpost.model.js";
import { VideoPost } from "../../model/videopost.model.js";
import { ImagePost } from "../../model/imagepost.model.js";


const CreateEnv = asyncHandler(async (req,res) => {
     const {envName, EnvDescription} = req.body

     const imagePath = req.file?.path

     let image;

     if(imagePath) {
          image = await uploadOnCloudinary(imagePath)
          if(!image.url) {
               throw new ApiError(409, "Error occured while generating the cloudinary url")
          }
     }

     const newEnv = Env.create({
          name: envName,
          description: EnvDescription,
          CreatedBy: req.user?._id,
          envAvatar: image?.url
     })
     return res
     .status(200)
     .json(
          new ApiResponse(200, newEnv, "Successfully liked the post")
     )
})

const getEnvs = asyncHandler(async (req, res) => {
     const envs = await Env.aggregate([
          /*Task: We are trying to check if the current user (req.user._id) has joined the community or not*/
          /*Pipeline 1: lookup for the joins*/
          {
               $lookup: { /**/
                    from: "joins",
                    localField: "name",
                    foreignField: "community",     
                    as: "isJoinedBy"
               },
          },{
               $addFields: {
                    isJoined: {
                         $cond: {
                              if: { $in:[req.user?._id,"$isJoinedBy.JoinedBy"]},
                              then: true,
                              else: false
                         }
                    }
               }
               
          }
     ])

     return res
     .status(200)
     .json(
          new ApiResponse(200, envs, "Successfully liked the post")
)})

const joinCommunity = asyncHandler(async (req, res) => {
     const {title, shouldJoin} = req.body;
      
     let JoinStatus;
     let newJoin;
     const existingJoin = await Joins.findOne({
          community: title,
          JoinedBy: req.user?._id
     })
     
     if(shouldJoin === true) {
          if(!existingJoin) {
               newJoin = await Joins.create({
                    community: title,
                    JoinedBy: req.user?._id
               })
          } else {
               newJoin = existingJoin
          }
          JoinStatus = true
     } else {
          if(existingJoin) {
               await existingJoin.deleteOne();
          }
          JoinStatus = false
     }
     
     return res
     .status(200)
     .json(
          new ApiResponse(200, {newJoin, JoinStatus}, "Successfully created joined New User")
     )
})

const getEnvPosts = asyncHandler(async (req, res) => {
     let { envname } = req.params
     console.log(envname)

     const blogPosts = await BlogPost.aggregate([
          {
               $match: {
                    community: envname
               }
          },
         {
             $lookup: {
                 from: "users",
                 localField: "PostAuthor",
                 foreignField: "_id",
                 as: "author",
                 pipeline: [
                     {
                         $project: {
                             fullname: 1,
                             username:1,
                             avatar: 1
                         }
                     }
                 ]
             }
         },
         {
             $lookup: {
                 from: "likes",
                 localField: "_id",
                 foreignField: "blogpost",
                 as: "likes"
             }
         }, 
         {
             $addFields: {
                 isLiked: {
                     $cond: {
                         if: {$in: [req.user?._id, "$likes.likedBy"]},
                         then: true,
                         else: false
                     }
                 },
                 likesCount: {
                     $size: "$likes"
                 }
             }
         }
     ]);
 
     const imagePosts = await ImagePost.aggregate([
          {
               $match: {
                    community: envname
               }
          },
         {
             $lookup: {
                 from: "users",
                 localField: "PostAuthor",
                 foreignField: "_id",
                 as: "author",
                 pipeline: [
                     {
                         $project: {
                             fullname: 1,
                             username:1,
                             avatar: 1
                         }
                     }
                 ]
             }
         },
         {
             $lookup: {
                 from: "likes",
                 localField: "_id",
                 foreignField: "image",
                 as: "likes"
             }
         }, 
         {
             $addFields: {
                 isLiked: {
                     $cond: {
                         if: {$in: [req.user?._id, "$likes.likedBy"]},
                         then: true,
                         else: false
                     }
                 },
                 likesCount: {
                     $size: "$likes"
                 }
             }
         }
     ]);
     const videoPosts = await VideoPost.aggregate([
          {
               $match: {
                    community: envname
               }
          },
         {
             $lookup: {
                 from: "users",
                 localField: "PostAuthor",
                 foreignField: "_id",
                 as: "author",
                 pipeline: [
                     {
                         $project: {
                             fullname: 1,
                             username:1,
                             avatar: 1
                         }
                     }
                 ]
             }
         },
         {
             $lookup: {
                 from: "likes",
                 localField: "_id",
                 foreignField: "video",
                 as: "likes"
             }
         }, 
         {
             $addFields: {
                 isLiked: {
                     $cond: {
                         if: {$in: [req.user?._id, "$likes.likedBy"]},
                         then: true,
                         else: false
                     }
                 },
                 likesCount: {
                     $size: "$likes"
                 }
             }
         }
     ]);
     //combining the posts
     const allPosts = [...blogPosts, ...imagePosts, ...videoPosts];
 
     allPosts.sort((a, b) => b.createdAt - a.createdAt);
 
     
     res
     .status(201)
     .json({"done":allPosts})
 })
 
 const getEnvBlogPosts = asyncHandler(async (req, res) => {
     let { envname } = req.params
     console.log(envname)

     const blogPosts = await BlogPost.aggregate([
          {
               $match: {
                    community: envname
               }
          },
         {
             $lookup: {
                 from: "users",
                 localField: "PostAuthor",
                 foreignField: "_id",
                 as: "author",
                 pipeline: [
                     {
                         $project: {
                             fullname: 1,
                             username:1,
                             avatar: 1
                         }
                     }
                 ]
             }
         }
     ]);
     //combining the posts
     const allPosts = [...blogPosts];
 
     allPosts.sort((a, b) => b.createdAt - a.createdAt);
 
     
     res
     .status(201)
     .json({"done":allPosts})
 })
 
 const getEnvImagePosts = asyncHandler(async (req, res) => {
     let { envname } = req.params
     console.log(envname)

     const imagePosts = await ImagePost.aggregate([
          {
               $match: {
                    community: envname
               }
          },
         {
             $lookup: {
                 from: "users",
                 localField: "PostAuthor",
                 foreignField: "_id",
                 as: "author",
                 pipeline: [
                     {
                         $project: {
                             fullname: 1,
                             username:1,
                             avatar: 1
                         }
                     }
                 ]
             }
         }
     ]);
 
     //combining the posts
     const allPosts = [...imagePosts];
 
     allPosts.sort((a, b) => b.createdAt - a.createdAt);
 
     res
     .status(201)
     .json({"done":allPosts})
 })
 
 const getEnvVideoPosts = asyncHandler(async (req, res) => {
     let { envname } = req.params

     console.log(envname)
     const videoPosts = await VideoPost.aggregate([
          {
               $match: {
                    community: envname
               }
          },
         {
             $lookup: {
                 from: "users",
                 localField: "PostAuthor",
                 foreignField: "_id",
                 as: "author",
                 pipeline: [
                     {
                         $project: {
                             fullname: 1,
                             username:1,
                             avatar: 1
                         }
                     }
                 ]
             }
         }
     ]);
 
     //combining the posts
     const allPosts = [...videoPosts];
 
     allPosts.sort((a, b) => b.createdAt - a.createdAt);
     res
     .status(201)
     .json({"done":allPosts})
 })
 

export {
     CreateEnv,
     getEnvs,
     joinCommunity,
     getEnvPosts,
     getEnvBlogPosts,
     getEnvImagePosts,
     getEnvVideoPosts
};
