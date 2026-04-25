import fs from "fs";
import {
  compressImage,
  compressImageForOriginal,
} from "../compressorFunctions/imageCompressor";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!fs.existsSync(localFilePath)) return null;

    const result = await cloudinary.v2.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    fs.unlinkSync(localFilePath); // Clean up local file
    return result;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Clean up on failure
    }
    console.error("❌ Cloudinary upload failed:", error);
    return null;
  }
};

export const processImageWithMetadata = async (
  file: Express.Multer.File
): Promise<{
  original: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  };
  thumbnail: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  };
}> => {
  const compressedOriginal = await compressImageForOriginal(file);
  const compressedThumb = await compressImage(file);

  const [originalUpload, thumbnailUpload] = await Promise.all([
    uploadOnCloudinary(compressedOriginal.path),
    uploadOnCloudinary(compressedThumb.path),
  ]);

  if (!originalUpload || !thumbnailUpload) {
    throw new Error("Cloudinary upload failed for one or more files.");
  }

  return {
    original: {
      url: originalUpload.secure_url,
      filename: originalUpload.public_id,
      mimetype: originalUpload.resource_type,
      size: originalUpload.bytes,
    },
    thumbnail: {
      url: thumbnailUpload.secure_url,
      filename: thumbnailUpload.public_id,
      mimetype: thumbnailUpload.resource_type,
      size: thumbnailUpload.bytes,
    },
  };
};
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary deletion failed:", error);
    return null;
  }
};
