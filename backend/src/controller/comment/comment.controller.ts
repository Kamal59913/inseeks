// @ts-nocheck
import { asyncHandler } from "../../utils/response/asyncHandler";
import { CommentPost } from "../../model/comment.model.js";
import { ApiResponse } from "../../utils/response/ApiResponse";
import mongoose from "mongoose";

const createComment = asyncHandler(async (req, res) => {
    const { Post_Id, content } = req.body
    const comment = await CommentPost.create({
        PostId: Post_Id,
        CommentAuthor: req.user._id,
        content: content,
    })
    return res
    .status(201)
    .json(
        new ApiResponse(200, comment, "The comment has been successfully created")
    )
})

const retrieveComment = asyncHandler(async (req, res) => {
    const { Post_Id } = req.body
    console.log(Post_Id)
    let find;

    const comment = await CommentPost.aggregate([
        {
            $match: {
                PostId: Post_Id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "CommentAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [{
                    $project: {
                        username: 1,
                        fullname: 1,
                        avatar: 1
                   }
                }]
            }
        },
        {
            $addFields: {
                username: { $arrayElemAt: ["$author.username", 0] },
                avatar: { $arrayElemAt: ["$author.avatar", 0] }
            }
        },
        {
            $project: {
                username: 1,
                avatar: 1,
                content: 1
            }
        }
    ])

    console.log(comment.length)

    return res
    .status(201)
    .json(
        new ApiResponse(200, comment, "The comment has been fetched")
    )
})

export {
    createComment,
    retrieveComment
}
