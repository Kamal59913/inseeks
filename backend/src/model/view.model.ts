import mongoose, { Schema, Document } from "mongoose";

export interface IView extends Document {
    postId: string;
    postType: string;
    viewedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const viewSchema = new Schema<IView>(
  {
    postId: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      required: true,
      enum: ["image", "video", "blogpost"],
    },
    viewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

viewSchema.index({ postId: 1, viewedBy: 1 }, { unique: true });

export const View = mongoose.model<IView>("View", viewSchema);
