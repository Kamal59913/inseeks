import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const imagePostSchema = new Schema(
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
export const ImagePost = mongoose.model("ImagePost", imagePostSchema)