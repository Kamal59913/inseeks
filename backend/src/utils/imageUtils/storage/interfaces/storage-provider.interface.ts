export interface FileMetadata {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface IStorageProvider {
  /**
   * Upload a file buffer to the storage provider
   * @param buffer The file buffer to upload
   * @param filename Desired filename or category
   * @param folder Optional folder/path
   */
  upload(
    buffer: Buffer,
    filename: string,
    folder?: string,
  ): Promise<FileMetadata>;

  /**
   * Delete a file from the storage provider
   * @param fileId The unique identifier of the file (e.g., public_id or file path)
   */
  delete(fileId: string): Promise<void>;

  /**
   * Get the name of the provider for debugging/logging
   */
  getName(): string;
}
