import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema({
    image: {
        type: Schema.Types.ObjectId,
        ref: "ImagePost"
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "VideoPost"
    },
    blogpost: {
        type: Schema.Types.ObjectId,
        ref: "BlogPost"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

likeSchema.plugin(mongooseAggregatePaginate)
export const Likes = mongoose.model("Likes", likeSchema)