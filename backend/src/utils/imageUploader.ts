import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    console.log("🚀 Upload to Cloudinary initiated for path:", localFilePath);

    if (!localFilePath) {
      console.log("❌ No file path provided");
      return null;
    }

    const fileExists = fs.existsSync(localFilePath);
    console.log(`📁 File exists at ${localFilePath}:`, fileExists);
    if (!fileExists) {
      console.log("❌ File does not exist:", localFilePath);
      return null;
    }

    let response;
    try {
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
    } catch (uploadError: any) {
      console.error("❌ Cloudinary upload failed (inner try):", uploadError.message);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("🧹 Local file deleted after Cloudinary failure.");
      }
      return null;
    }

    console.log("✅ File uploaded to Cloudinary:", response);

    fs.unlinkSync(localFilePath);
    console.log("🧹 Local file deleted after Cloudinary upload.");

    return response;
  } catch (error: any) {
    console.log("❌ Cloudinary Upload Error (outer try):", error.message);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("🧹 Local file deleted after Cloudinary failure.");
    }
    return null;
  }
};

// LINODE S3 CONFIGURATION
const getEnv = (varName: string): string => {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
  return value;
};

const accessKeyId = getEnv("LINODE_ACCESS_KEY_ID");
const secretAccessKey = getEnv("LINODE_SECRET_ACCESS_KEY");
const endpoint = getEnv("LINODE_END_POINT");
const region = getEnv("LINODE_REGION");

console.log("🛠 Linode S3 config initialized:", {
  accessKeyId,
  endpoint,
  region,
});

const s3Client = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// LINODE UPLOAD FUNCTION
const uploadFilesToLinode = async (files: any) => {
  const responses = [];

  for (const file of files) {
    try {
      console.log("🔄 Starting upload for file:", {
        originalname: file.originalname,
        path: file.path,
      });

      const fileExists = fs.existsSync(file.path);
      console.log(`File exists at ${file.path}:`, fileExists);
      if (!fileExists) {
        console.log("❌ File does not exist, skipping upload:", file.path);
        responses.push({
          message: "File not found",
          path: file.path,
        });
        continue;
      }

      const fileStream = fs.createReadStream(file.path);
      const fileKey = `${uuidv4()}-${file.originalname}`;
      console.log("📁 Uploading file with key:", fileKey);

      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
        Body: fileStream,
        ACL: "public-read",
      });

      let response;
      try {
        response = await s3Client.send(putObjectCommand);
      } catch (error: any) {
        console.error("❌ Linode Upload Error (inner try):", error.message);
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
          console.log("🧹 Local file deleted after Linode failure");
        }
        responses.push({
          message: "Upload failed",
          error: error.message,
          key: fileKey,
        });
        continue; // Skip further execution for this file
      }

      // Check if the response is valid
      if (!response || !response.$metadata || response.$metadata.httpStatusCode !== 200) {
        console.warn("⚠️ Invalid or incomplete response received for:", fileKey);
        responses.push({
          message: "Upload failed or uncertain",
          key: fileKey,
          data: response,
        });
        continue;
      }

      console.log("✅ File uploaded to Linode:", response);
      fs.unlinkSync(file.path);
      console.log("🧹 Local file deleted after Linode upload");

      responses.push({
        message: "File uploaded successfully",
        data: response,
        key: fileKey,
      });
    } catch (error: any) {
      console.error("❌ Linode Upload Error (outer try):", error.message);
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log("🧹 Local file deleted after Linode failure");
      }
      responses.push({
        message: "Upload failed",
        error: error.message,
      });
    }
  }

  return responses;
};



const deleteFromLinode = async (fileUrlOrKey: string) => {
  console.log("🗑 Attempting to delete file from Linode input:", fileUrlOrKey);

  if (!fileUrlOrKey) {
    console.error("❌ No input provided for deletion.");
    return {
      success: false,
      message: "File URL or key is required",
    };
  }

  try {
    // Trim and extract key if a full URL is passed
    const trimmed = fileUrlOrKey.trim();
    const fileKey = trimmed.includes("/") ? trimmed.split("/").pop()! : trimmed;

    if (!fileKey) {
      console.error("❌ Could not extract valid file key from input.");
      return {
        success: false,
        message: "Invalid file key extracted",
      };
    }

    console.log("📎 Extracted file key:", fileKey);

    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    const response = await s3Client.send(command);

    if (response.$metadata.httpStatusCode === 204) {
      console.log("✅ File deleted successfully:", fileKey);
      return {
        success: true,
        message: "File deleted successfully",
        key: fileKey,
      };
    } else {
      console.warn("⚠️ Unexpected response on delete:", response);
      return {
        success: false,
        message: "Unexpected delete response",
        response,
      };
    }
  } catch (error: any) {
    console.error("❌ Failed to delete file from Linode:", error.message);
    return {
      success: false,
      message: "Error deleting file",
      error: error.message,
    };
  }
};


export { uploadOnCloudinary, uploadFilesToLinode, deleteFromLinode };
