// @ts-nocheck
import { asyncHandler } from "../../utils/response/asyncHandler";
import { ApiResponse } from "../../utils/response/ApiResponse";
import { Env } from "../../model/env.model";
import { uploadOnCloudinary } from "../../utils/cloudinary";
import { ApiError } from "../../utils/response/ApiError";
import { Joins } from "../../model/joins.model";
import { BlogPost } from "../../model/blogpost.model";
import { VideoPost } from "../../model/videopost.model";
import { ImagePost } from "../../model/imagepost.model";

const parsePagination = (req, fallbackLimit = 8) => {
     const parsedLimit = Number.parseInt(req.query.limit, 10)
     const parsedOffset = Number.parseInt(req.query.offset, 10)
     const limit = Number.isNaN(parsedLimit) ? fallbackLimit : Math.min(Math.max(parsedLimit, 1), 20)
     const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(parsedOffset, 0)

     return { limit, offset }
}

const buildPagination = (totalCount, limit, offset) => {
     const hasMore = offset + limit < totalCount

     return {
          limit,
          offset,
          nextOffset: hasMore ? offset + limit : null,
          hasMore
     }
}

const buildVoteLookupStages = (targetField, userId) => [
     {
          $lookup: {
               from: "likes",
               localField: "_id",
               foreignField: targetField,
               as: "votes"
          }
     },
     {
          $addFields: {
               upvotesCount: {
                    $size: {
                         $filter: {
                              input: "$votes",
                              as: "vote",
                              cond: { $eq: ["$$vote.voteType", "upvote"] }
                         }
                    }
               },
               downvotesCount: {
                    $size: {
                         $filter: {
                              input: "$votes",
                              as: "vote",
                              cond: { $eq: ["$$vote.voteType", "downvote"] }
                         }
                    }
               },
               userVote: {
                    $let: {
                         vars: {
                              myVote: {
                                   $arrayElemAt: [
                                        {
                                             $filter: {
                                                  input: "$votes",
                                                  as: "vote",
                                                  cond: { $eq: ["$$vote.likedBy", userId] }
                                             }
                                        },
                                        0
                                   ]
                              }
                         },
                         in: "$$myVote.voteType"
                    }
               }
          }
     },
     {
          $addFields: {
               score: { $subtract: ["$upvotesCount", "$downvotesCount"] }
          }
     },
     {
          $project: {
               votes: 0
          }
     }
]

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
     const { limit, offset } = parsePagination(req, 8)
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
          new ApiResponse(200, {
               items: envs.slice(offset, offset + limit),
               pagination: buildPagination(envs.length, limit, offset)
          }, "Successfully liked the post")
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
     const { limit, offset } = parsePagination(req, 5)
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
         ...buildVoteLookupStages("blogpost", req.user?._id)
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
         ...buildVoteLookupStages("image", req.user?._id)
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
         ...buildVoteLookupStages("video", req.user?._id)
     ]);
     //combining the posts
     const allPosts = [...blogPosts, ...imagePosts, ...videoPosts];
 
     allPosts.sort((a, b) => b.createdAt - a.createdAt);
 
     
     res
     .status(201)
     .json({"done":allPosts.slice(offset, offset + limit),"pagination":buildPagination(allPosts.length, limit, offset)})
 })
 
 const getEnvBlogPosts = asyncHandler(async (req, res) => {
     let { envname } = req.params
     const { limit, offset } = parsePagination(req, 5)
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
         ...buildVoteLookupStages("blogpost", req.user?._id)
     ]);
     //combining the posts
     const allPosts = [...blogPosts];
 
     allPosts.sort((a, b) => b.createdAt - a.createdAt);
 
     
     res
     .status(201)
     .json({"done":allPosts.slice(offset, offset + limit),"pagination":buildPagination(allPosts.length, limit, offset)})
 })
 
 const getEnvImagePosts = asyncHandler(async (req, res) => {
     let { envname } = req.params
     const { limit, offset } = parsePagination(req, 5)
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
         },
         ...buildVoteLookupStages("image", req.user?._id)
     ]);
 
     //combining the posts
     const allPosts = [...imagePosts];
 
     allPosts.sort((a, b) => b.createdAt - a.createdAt);
 
     res
     .status(201)
     .json({"done":allPosts.slice(offset, offset + limit),"pagination":buildPagination(allPosts.length, limit, offset)})
 })
 
 const getEnvVideoPosts = asyncHandler(async (req, res) => {
     let { envname } = req.params
     const { limit, offset } = parsePagination(req, 5)

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
         },
         ...buildVoteLookupStages("video", req.user?._id)
     ]);
 
     //combining the posts
     const allPosts = [...videoPosts];
 
     allPosts.sort((a, b) => b.createdAt - a.createdAt);
     res
     .status(201)
     .json({"done":allPosts.slice(offset, offset + limit),"pagination":buildPagination(allPosts.length, limit, offset)})
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
