import fs from "fs";
import path from "path";
import {
  IStorageProvider,
  FileMetadata,
} from "../interfaces/storage-provider.interface";

export class LocalDiskStorageProvider implements IStorageProvider {
  private readonly uploadDir = path.join(
    process.cwd(),
    "src",
    "public",
    "uploads",
  );

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    buffer: Buffer,
    filename: string,
    folder: string = "",
  ): Promise<FileMetadata> {
    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, "-")}`;
    const filePath = path.join(targetFolder, uniqueFilename);

    await fs.promises.writeFile(filePath, buffer);

    // Relative path for URL
    const relativePath = path
      .join("uploads", folder, uniqueFilename)
      .replace(/\\/g, "/");

    return {
      url: `/${relativePath}`,
      filename: uniqueFilename,
      mimetype: "image/jpeg",
      size: buffer.length,
    };
  }

  async delete(fileId: string): Promise<void> {
    const filePath = path.join(this.uploadDir, fileId);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  getName(): string {
    return "LocalDisk";
  }
}
