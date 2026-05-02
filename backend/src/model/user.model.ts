import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    username: string;
    email: string;
    fullname: string;
    avatar?: string;
    coverImage?: string;
    about: string;
    clickHistory: mongoose.Types.ObjectId[];
    password?: string;
    refreshToken?: string;
    forgotPasswordOTP?: string;
    forgotPasswordExpiry?: Date;
    isPassWordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
{
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        // required: true,
    },
    coverImage: {
        type: String
    },
    about: {
        type: String,
        default: "",
    },
    clickHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    },
    forgotPasswordOTP: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    }
},
{
    timestamps: true
}
)
userSchema.pre("save", async function (this: IUser, next) { /*Arrow function do not have this keyword for the context*/
    if(!this.isModified("password")) return next();
    if(this.password) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})
 
userSchema.methods.isPassWordCorrect = async function(this: IUser, password: string) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password)
}
 
userSchema.methods.generateAccessToken = function(this: IUser) {
    return jwt.sign({
        _id:this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken = function(this: IUser) {
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}
export const User = mongoose.model<IUser>("User", userSchema)