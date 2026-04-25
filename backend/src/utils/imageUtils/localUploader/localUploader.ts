import fs from "fs";
import path from "path";
import { compressImage, compressImageForOriginal } from "../compressorFunctions/imageCompressor";

const assetsDir = path.join(process.cwd(), "src", "public", "assets");

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const moveToAssets = (
  file: Express.Multer.File,
  prefix: "original" | "thumb"
): {
  filename: string;
  mimetype: string;
  size: number;
  url: string;
} => {
  const newFilename = `${prefix}-${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
  const finalPath = path.join(assetsDir, newFilename);

  fs.copyFileSync(file.path, finalPath);
  fs.unlinkSync(file.path); // delete from temp

  return {
    filename: newFilename,
    mimetype: file.mimetype,
    size: file.size,
    url: `/assets/${newFilename}`,
  };
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

  const originalMeta = moveToAssets(compressedOriginal, "original");
  const thumbnailMeta = moveToAssets(compressedThumb, "thumb");

  return {
    original: originalMeta,
    thumbnail: thumbnailMeta,
  };
};
