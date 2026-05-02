import { config as loadEnv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

let isConfigured = false;

const ensureCloudinaryConfigured = () => {
  if (isConfigured) return;

  loadEnv();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary environment variables are missing. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  isConfigured = true;
};

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    console.log(localFilePath, "this one");

    if (!localFilePath) {
      console.log("reached here on !localFilePath");
      return null;
    }

    ensureCloudinaryConfigured();

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.log("Cloudinary upload failed", error?.message || error);
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

export { uploadOnCloudinary };
