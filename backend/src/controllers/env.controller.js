import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const CreateEnv = asyncHandler(async (req,res) => {
     const {envName, EnvDescription} = req.body
     console.log("Reached", envName, EnvDescription)

     let find = 'done'
     return res
     .status(200)
     .json(
          new ApiResponse(200, find, "Successfully liked the post")
     )
})

export {
     CreateEnv
};