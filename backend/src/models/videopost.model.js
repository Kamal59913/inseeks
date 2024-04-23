import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoPostSchema = new Schema(
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
export const VideoPost = mongoose.model("VideoPost", videoPostSchema)