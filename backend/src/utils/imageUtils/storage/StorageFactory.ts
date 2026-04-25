import { IStorageProvider } from "./interfaces/storage-provider.interface";
import { LocalDiskStorageProvider } from "./providers/LocalDiskStorageProvider";
import { CloudinaryStorageProvider } from "./providers/CloudinaryStorageProvider";
import { S3StorageProvider } from "./providers/S3StorageProvider";

export enum StorageProviderType {
  LOCAL = "local",
  CLOUDINARY = "cloudinary",
  S3 = "s3",
  LINODE = "linode",
}

export class StorageFactory {
  private static instance: IStorageProvider;

  static getProvider(): IStorageProvider {
    if (this.instance) return this.instance;

    const providerType = (
      process.env.STORAGE_PROVIDER || "local"
    ).toLowerCase();

    switch (providerType) {
      case StorageProviderType.CLOUDINARY:
        this.instance = new CloudinaryStorageProvider();
        break;
      case StorageProviderType.S3:
      case StorageProviderType.LINODE:
        this.instance = new S3StorageProvider();
        break;
      case StorageProviderType.LOCAL:
      default:
        this.instance = new LocalDiskStorageProvider();
        break;
    }

    console.log(`🚀 Using Storage Provider: ${this.instance.getName()}`);
    return this.instance;
  }
}
