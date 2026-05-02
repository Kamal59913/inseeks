import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IImagePost extends Document {
    title: string;
    images?: string[];
    type: string;
    views: number;
    community?: string;
    isPublished: boolean;
    PostAuthor?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const imagePostSchema = new Schema<IImagePost>(
    {
        title : {
            type: String,
            required: true
        },
        images: [{
            type: String,
        }],
        type: {
            type: String,
            default: "image"
        },
        views: {
            type: Number,
            default: 0
        },
        community: {
            type: String
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        PostAuthor : {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    }, 
    {
        timestamps: true
    }
)

imagePostSchema.plugin(mongooseAggregatePaginate)
export const ImagePost = mongoose.model<IImagePost>("ImagePost", imagePostSchema)