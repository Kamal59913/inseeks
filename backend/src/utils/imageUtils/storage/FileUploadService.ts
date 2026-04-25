import sharp from "sharp";
import {
  IStorageProvider,
  FileMetadata,
} from "./interfaces/storage-provider.interface";
import { StorageFactory } from "./StorageFactory";

export interface ProcessedImageResult {
  original: FileMetadata;
  thumbnail: FileMetadata;
}

export class FileUploadService {
  private readonly storageProvider: IStorageProvider;

  constructor() {
    this.storageProvider = StorageFactory.getProvider();
  }

  /**
   * Process image into original version using Sharp
   */
  private async processOriginalBuffer(
    file: Express.Multer.File,
  ): Promise<Buffer> {
    return sharp(file.buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .toFormat("jpeg", { quality: 85 })
      .toBuffer();
  }

  /**
   * Process image into thumbnail version using Sharp
   */
  private async processThumbnailBuffer(
    file: Express.Multer.File,
  ): Promise<Buffer> {
    return sharp(file.buffer)
      .resize(400, 400, { fit: "cover" })
      .toFormat("jpeg", { quality: 70 })
      .toBuffer();
  }

  /**
   * Main entry point: Processes image in memory and uploads via Strategy
   */
  async processImageWithMetadata(
    file: Express.Multer.File,
  ): Promise<ProcessedImageResult> {
    if (!file.buffer) {
      throw new Error(
        "File buffer is missing. Ensure multer memoryStorage is used.",
      );
    }

    try {
      // Parallel processing for performance
      const [originalBuffer, thumbBuffer] = await Promise.all([
        this.processOriginalBuffer(file),
        this.processThumbnailBuffer(file),
      ]);

      // Parallel streaming via Strategy
      const [originalUpload, thumbnailUpload] = await Promise.all([
        this.storageProvider.upload(
          originalBuffer,
          file.originalname,
          "originals",
        ),
        this.storageProvider.upload(
          thumbBuffer,
          `thumb-${file.originalname}`,
          "thumbnails",
        ),
      ]);

      return {
        original: originalUpload,
        thumbnail: thumbnailUpload,
      };
    } catch (error: any) {
      console.error(
        `❌ Upload Failed using ${this.storageProvider.getName()}:`,
        error,
      );
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Bulk upload support
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
  ): Promise<ProcessedImageResult[]> {
    const results = await Promise.all(
      files.map((file) =>
        this.processImageWithMetadata(file).catch(() => null),
      ),
    );

    const successful = results.filter(
      (r) => r !== null,
    ) as ProcessedImageResult[];

    if (successful.length === 0 && files.length > 0) {
      throw new Error("All file uploads failed");
    }

    return successful;
  }

  /**
   * Remote deletion via Strategy
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      if (!fileId) return;
      await this.storageProvider.delete(fileId);
    } catch (error) {
      console.error(
        `❌ Deletion failed on ${this.storageProvider.getName()}:`,
        error,
      );
    }
  }
}

// Export a singleton instance
export const fileUploadService = new FileUploadService();
