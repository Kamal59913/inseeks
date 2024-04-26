import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const envSchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
    },
    JoinedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

envSchema.plugin(mongooseAggregatePaginate)
export const Env = mongoose.model("Env", envSchema)