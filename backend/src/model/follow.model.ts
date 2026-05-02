import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IFollow extends Document {
    subscriber?: mongoose.Types.ObjectId;
    channel?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const followSchema = new Schema<IFollow>({
    subscriber: {
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true}) // fixed timeseries to timestamps

followSchema.plugin(mongooseAggregatePaginate)
export const Follow = mongoose.model<IFollow>("follow", followSchema)