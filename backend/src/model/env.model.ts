import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IEnv extends Document {
    name?: string;
    description?: string;
    envAvatar?: string;
    CreatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const envSchema = new Schema<IEnv>({
    name: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
    },
    envAvatar: {
        type: String
    },
    CreatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

envSchema.plugin(mongooseAggregatePaginate)
export const Env = mongoose.model<IEnv>("Env", envSchema)