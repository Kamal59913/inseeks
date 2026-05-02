import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface ICommentPost extends Document {
    PostId: string;
    CommentAuthor?: mongoose.Types.ObjectId;
    content: string;
    attachments?: {
        url: string;
        resourceType?: string;
        mimeType?: string;
        originalName?: string;
        bytes?: number;
    }[];
    type: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const commentPostSchema = new Schema<ICommentPost>(
    {
        PostId : {
            type: String,
            required: true
        },
        CommentAuthor : {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            default: ""
        },
        attachments: [
            {
                url: {
                    type: String,
                    required: true,
                },
                resourceType: {
                    type: String,
                },
                mimeType: {
                    type: String,
                },
                originalName: {
                    type: String,
                },
                bytes: {
                    type: Number,
                }
            }
        ],
        type: {
            type: String,
            default: "video"
        },
        isPublished: {
            type: Boolean,
            default: true
        }
    }, 
    {
        timestamps: true
    }
)

commentPostSchema.plugin(mongooseAggregatePaginate)
export const CommentPost = mongoose.model<ICommentPost>("CommentPost", commentPostSchema)
