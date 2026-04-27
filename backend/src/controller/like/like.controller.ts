// @ts-nocheck
import mongoose from "mongoose";
import { asyncHandler } from "../../utils/response/asyncHandler";
import { ApiResponse } from "../../utils/response/ApiResponse";
import { ApiError } from "../../utils/response/ApiError";
import { Likes } from "../../model/likes.model.js";
import { getIO } from "../../socket/socketconnect";
import { CommentPost } from "../../model/comment.model.js";
import { User } from "../../model/user.model.js";

const SUPPORTED_TYPES = ["image", "video", "blogpost", "comment"];
const SUPPORTED_VOTES = ["upvote", "downvote"];

const getVoteSummary = async (targetField, targetId, userId) => {
  const targetObjectId = new mongoose.Types.ObjectId(targetId);

  const [upvotesCount, downvotesCount, existingVote] = await Promise.all([
    Likes.countDocuments({ [targetField]: targetObjectId, voteType: "upvote" }),
    Likes.countDocuments({ [targetField]: targetObjectId, voteType: "downvote" }),
    Likes.findOne({ [targetField]: targetObjectId, likedBy: userId }).lean(),
  ]);

  return {
    upvotesCount,
    downvotesCount,
    score: upvotesCount - downvotesCount,
    userVote: existingVote?.voteType || null,
  };
};

const LikePost = asyncHandler(async (req, res) => {
  const { PostId, CommentId, type, voteType } = req.body;
  const targetField = type;
  const targetId = CommentId || PostId;

  if (!SUPPORTED_TYPES.includes(targetField)) {
    throw new ApiError(400, "Invalid vote target type");
  }

  if (!targetId) {
    throw new ApiError(400, "Target id is required");
  }

  if (!SUPPORTED_VOTES.includes(voteType)) {
    throw new ApiError(400, "voteType must be upvote or downvote");
  }

  const existingVote = await Likes.findOne({
    [targetField]: targetId,
    likedBy: req.user._id,
  });

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      await Likes.findByIdAndDelete(existingVote._id);
    } else {
      existingVote.voteType = voteType;
      await existingVote.save();
    }
  } else {
    await Likes.create({
      [targetField]: targetId,
      likedBy: req.user._id,
      voteType,
    });
  }

  const summary = await getVoteSummary(targetField, targetId, req.user._id);

  if (targetField === "comment") {
    const [comment, actor] = await Promise.all([
      CommentPost.findById(targetId).lean(),
      User.findById(req.user._id).select("username avatar").lean(),
    ]);

    if (comment?.PostId) {
      const io = getIO();
      io?.to(`discussion:${comment.PostId}`).emit("discussion:vote-updated", {
        postId: comment.PostId,
        commentId: String(targetId),
        summary,
        actor: {
          username: actor?.username || "Anonymous",
          avatar: actor?.avatar,
        },
        voteType,
      });
    }
  }

  return res.status(200).json(
    new ApiResponse(200, summary, "Vote updated successfully"),
  );
});

const GetPostLike = asyncHandler(async (req, res) => {
  const { PostId, CommentId, type } = req.body;
  const targetField = type;
  const targetId = CommentId || PostId;

  if (!SUPPORTED_TYPES.includes(targetField)) {
    throw new ApiError(400, "Invalid vote target type");
  }

  if (!targetId) {
    throw new ApiError(400, "Target id is required");
  }

  const summary = await getVoteSummary(targetField, targetId, req.user._id);

  return res.status(200).json(
    new ApiResponse(200, summary, "Vote details fetched successfully"),
  );
});

export { LikePost, GetPostLike };
