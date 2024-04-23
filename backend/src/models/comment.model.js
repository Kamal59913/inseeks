import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentPostSchema = new Schema(
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
            required: true
        },
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
export const CommentPost = mongoose.model("CommentPost", commentPostSchema)