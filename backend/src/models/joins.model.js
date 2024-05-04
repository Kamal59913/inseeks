import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const joinSchema = new Schema({
    community: {
        type: String
    },
    JoinedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

joinSchema.plugin(mongooseAggregatePaginate)
export const Joins = mongoose.model("Joins", joinSchema)