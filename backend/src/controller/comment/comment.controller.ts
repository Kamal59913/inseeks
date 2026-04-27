// @ts-nocheck
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { asyncHandler } from "../../utils/response/asyncHandler";
import { CommentPost } from "../../model/comment.model.js";
import { ApiResponse } from "../../utils/response/ApiResponse";
import { ApiError } from "../../utils/response/ApiError";
import { getIO } from "../../socket/socketconnect";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const PUBLIC_DISCUSSION_DOCS_DIR = path.resolve(process.cwd(), "src/public/uploads/discussions");

const ensureDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const buildPublicFileUrl = (req, relativePath) => {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto ? String(forwardedProto).split(",")[0] : req.protocol;
  const normalizedPath = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${protocol}://${req.get("host")}/${normalizedPath}`;
};

const persistDocumentLocally = (req, file) => {
  ensureDirectory(PUBLIC_DISCUSSION_DOCS_DIR);

  const extension = path.extname(file.originalname || file.filename || "");
  const baseName = path.basename(file.originalname || file.filename || "document", extension);
  const safeBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
  const finalFileName = `${Date.now()}-${safeBaseName}${extension || ""}`;
  const finalPath = path.join(PUBLIC_DISCUSSION_DOCS_DIR, finalFileName);

  fs.renameSync(file.path, finalPath);

  return {
    url: buildPublicFileUrl(req, path.join("uploads", "discussions", finalFileName)),
    resourceType: "raw",
    mimeType: file.mimetype,
    originalName: file.originalname,
    bytes: file.size,
  };
};

const uploadCommentAttachments = async (req, files = []) => {
  const attachments = [];

  for (const file of files) {
    const mimeType = file.mimetype?.toLowerCase() || "";
    const isDocument = mimeType === "application/pdf" || mimeType.startsWith("application/");

    if (isDocument) {
      attachments.push(persistDocumentLocally(req, file));
      continue;
    }

    const uploadedAsset = await uploadOnCloudinary(file.path);

    if (!uploadedAsset?.url && !uploadedAsset?.secure_url) {
      throw new ApiError(400, "Error while uploading a discussion attachment");
    }

    attachments.push({
      url: uploadedAsset.secure_url || uploadedAsset.url,
      resourceType: uploadedAsset.resource_type || file.mimetype?.split("/")[0],
      mimeType: file.mimetype,
      originalName: file.originalname,
      bytes: uploadedAsset.bytes || file.size,
    });
  }

  return attachments;
};

const createComment = asyncHandler(async (req, res) => {
  const { Post_Id, content = "", clientTempId } = req.body;
  const trimmedContent = String(content || "").trim();
  const uploadedFiles = Array.isArray(req.files) ? req.files : [];
  const attachments = await uploadCommentAttachments(req, uploadedFiles);

  if (!trimmedContent && attachments.length === 0) {
    throw new ApiError(400, "Please send a message or attach a file");
  }

  const comment = await CommentPost.create({
    PostId: Post_Id,
    CommentAuthor: req.user._id,
    content: trimmedContent,
    attachments,
  });

  const createdComment = await CommentPost.aggregate([
    {
      $match: {
        _id: comment._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "CommentAuthor",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$author.username", 0] },
        avatar: { $arrayElemAt: ["$author.avatar", 0] },
        upvotesCount: 0,
        downvotesCount: 0,
        userVote: null,
      },
    },
    {
      $project: {
        username: 1,
        avatar: 1,
        content: 1,
        attachments: 1,
        upvotesCount: 1,
        downvotesCount: 1,
        userVote: 1,
        createdAt: 1,
        Post_Id: { $literal: Post_Id },
        clientTempId: { $literal: clientTempId || null },
      },
    },
  ]);

  const io = getIO();
  io?.to(`discussion:${Post_Id}`).emit("discussion:new-message", {
    postId: Post_Id,
    comment: createdComment[0],
  });

  return res.status(201).json(
    new ApiResponse(200, createdComment[0], "The comment has been successfully created"),
  );
});

const retrieveComment = asyncHandler(async (req, res) => {
  const { Post_Id } = req.body;
  const currentUserId = new mongoose.Types.ObjectId(req.user._id);

  const comment = await CommentPost.aggregate([
    {
      $match: {
        PostId: Post_Id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "CommentAuthor",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "votes",
      },
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$author.username", 0] },
        avatar: { $arrayElemAt: ["$author.avatar", 0] },
        upvotesCount: {
          $size: {
            $filter: {
              input: "$votes",
              as: "vote",
              cond: { $eq: ["$$vote.voteType", "upvote"] },
            },
          },
        },
        downvotesCount: {
          $size: {
            $filter: {
              input: "$votes",
              as: "vote",
              cond: { $eq: ["$$vote.voteType", "downvote"] },
            },
          },
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
                      cond: { $eq: ["$$vote.likedBy", currentUserId] },
                    },
                  },
                  0,
                ],
              },
            },
            in: "$$myVote.voteType",
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        avatar: 1,
        content: 1,
        attachments: 1,
        upvotesCount: 1,
        downvotesCount: 1,
        userVote: 1,
        createdAt: 1,
      },
    },
  ]);

  return res.status(201).json(
    new ApiResponse(200, comment, "The comment has been fetched"),
  );
});

export {
  createComment,
  retrieveComment,
};
