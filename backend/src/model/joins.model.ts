import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface IJoins extends Document {
    community?: string;
    JoinedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const joinSchema = new Schema<IJoins>({
    community: {
        type: String
    },
    JoinedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

joinSchema.plugin(mongooseAggregatePaginate)
export const Joins = mongoose.model<IJoins>("Joins", joinSchema)