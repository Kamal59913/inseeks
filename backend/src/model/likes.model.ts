import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface ILikes extends Document {
    image?: mongoose.Types.ObjectId;
    video?: mongoose.Types.ObjectId;
    blogpost?: mongoose.Types.ObjectId;
    comment?: mongoose.Types.ObjectId;
    likedBy: mongoose.Types.ObjectId;
    voteType: string;
    createdAt: Date;
    updatedAt: Date;
}

const likeSchema = new Schema<ILikes>(
  {
    image: {
      type: Schema.Types.ObjectId,
      ref: "ImagePost",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "VideoPost",
    },
    blogpost: {
      type: Schema.Types.ObjectId,
      ref: "BlogPost",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "CommentPost",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      default: "upvote",
    },
  },
  { timestamps: true },
);

likeSchema.plugin(mongooseAggregatePaginate);
export const Likes = mongoose.model<ILikes>("Likes", likeSchema);
