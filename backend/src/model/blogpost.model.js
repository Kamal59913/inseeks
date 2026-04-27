import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const blogPostSchema = new Schema(
    {
        title : {
            type: String,
            required: true
        },
        description : {
            type: String,
        },
        image: {
            type: String,
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
            default: "blogpost"
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

blogPostSchema.plugin(mongooseAggregatePaginate)
export const BlogPost = mongoose.model("BlogPost", blogPostSchema)
