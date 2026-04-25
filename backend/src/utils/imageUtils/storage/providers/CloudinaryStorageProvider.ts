import { v2 as cloudinary } from "cloudinary";
import {
  IStorageProvider,
  FileMetadata,
} from "../interfaces/storage-provider.interface";
import { Readable } from "stream";

export class CloudinaryStorageProvider implements IStorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(
    buffer: Buffer,
    filename: string,
    folder: string = "uploads",
  ): Promise<FileMetadata> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: filename.split(".")[0],
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Cloudinary upload failed"));

          resolve({
            url: result.secure_url,
            filename: result.public_id,
            mimetype: result.format,
            size: result.bytes,
          });
        },
      );

      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }

  async delete(fileId: string): Promise<void> {
    await cloudinary.uploader.destroy(fileId);
  }

  getName(): string {
    return "Cloudinary";
  }
}
