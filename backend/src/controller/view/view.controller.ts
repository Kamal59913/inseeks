import { ApiError } from "../../utils/response/ApiError";
import { asyncHandler } from "../../utils/response/asyncHandler";
import { ApiResponse } from "../../utils/response/ApiResponse";
import { View } from "../../model/view.model";
import { BlogPost } from "../../model/blogpost.model";
import { ImagePost } from "../../model/imagepost.model";
import { VideoPost } from "../../model/videopost.model";

export const recordView = asyncHandler(async (req: any, res: any) => {
    const { postId } = req.params;
    const { postType } = req.body;
    const userId = req.user._id;

    if (!postId || !postType) {
        throw new ApiError(400, "Post ID and post type are required");
    }

    if (!["image", "video", "blogpost"].includes(postType)) {
        throw new ApiError(400, "Invalid post type");
    }

    // Check if the user already viewed this post (atomic upsert to prevent double count)
    const existingView = await View.findOneAndUpdate(
        { postId, viewedBy: userId },
        { $setOnInsert: { postId, postType, viewedBy: userId } },
        { upsert: true, new: false }
    );

    if (existingView) {
        // User already viewed, return success without incrementing
        return res.status(200).json(
            new ApiResponse(200, {}, "View already recorded")
        );
    }

    // Increment views count on the respective model
    let post;
    if (postType === "blogpost") {
        post = await BlogPost.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true });
    } else if (postType === "image") {
        post = await ImagePost.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true });
    } else if (postType === "video") {
        post = await VideoPost.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true });
    }

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res.status(201).json(
        new ApiResponse(201, { views: post.views }, "View recorded successfully")
    );
});
