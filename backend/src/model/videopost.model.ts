import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IVideoPost extends Document {
    description: string;
    video: string;
    type: string;
    community?: string;
    views: number;
    isPublished: boolean;
    PostAuthor?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const videoPostSchema = new Schema<IVideoPost>(
    {
        description : {
            type: String,
            required: true
        },
        video: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: "video"
        },
        community: {
            type: String
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        PostAuthor : {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, 
    {
        timestamps: true
    }
)

videoPostSchema.plugin(mongooseAggregatePaginate)
export const VideoPost = mongoose.model<IVideoPost>("VideoPost", videoPostSchema)