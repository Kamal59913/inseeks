import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import {
  IStorageProvider,
  FileMetadata,
} from "../interfaces/storage-provider.interface";

export class S3StorageProvider implements IStorageProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly endpoint?: string;

  constructor() {
    this.region = process.env.AWS_REGION || "us-east-1";
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || "";
    this.endpoint = process.env.AWS_S3_ENDPOINT;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
      endpoint: this.endpoint,
      forcePathStyle: !!this.endpoint, // true for Linode/DigitalOcean
    });
  }

  async upload(
    buffer: Buffer,
    filename: string,
    folder: string = "uploads",
  ): Promise<FileMetadata> {
    const fileKey = `${folder}/${uuidv4()}-${filename.replace(/\s+/g, "-")}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: "image/jpeg",
        ACL: "public-read",
      }),
    );

    // Construct URL based on endpoint or standard S3
    const url = this.endpoint
      ? `${this.endpoint}/${this.bucketName}/${fileKey}`
      : `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;

    return {
      url,
      filename: fileKey,
      mimetype: "image/jpeg",
      size: buffer.length,
    };
  }

  async delete(fileId: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileId,
      }),
    );
  }

  getName(): string {
    return "S3";
  }
}
