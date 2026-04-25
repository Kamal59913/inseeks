import sharp from "sharp";
import fs from "fs";
import path from "path";

export const compressImage = async (
  file: Express.Multer.File
): Promise<Express.Multer.File> => {
  const tempDir = path.join(process.cwd(), "src", "public", "temp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const timestamp = Date.now();
  const safeFilename = `compressed-${timestamp}-${path
    .basename(file.originalname)
    .replace(/\s+/g, "-")}`; // Remove spaces
  const compressedFilePath = path.join(tempDir, safeFilename);

  // Ensure the file exists before processing
  if (!file.buffer && (!file.path || !fs.existsSync(file.path))) {
    throw new Error(
      `File buffer is empty or file path does not exist: ${file.path}`
    );
  }

  try {
    await sharp(file.buffer || fs.readFileSync(file.path))
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(compressedFilePath);

    const stats = fs.statSync(compressedFilePath);
    const compressedFile: Express.Multer.File = {
      ...file,
      path: compressedFilePath,
      filename: safeFilename,
      size: stats.size,
      destination: tempDir,
    };
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

export const compressImageForOriginal = async (
  file: Express.Multer.File
): Promise<Express.Multer.File> => {
  const tempDir = path.join(process.cwd(), "src", "public", "temp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const timestamp = Date.now();
  const safeFilename = `compressed-${timestamp}-${path
    .basename(file.originalname)
    .replace(/\s+/g, "-")}`;
  const compressedFilePath = path.join(tempDir, safeFilename);

  let buffer = file.buffer || fs.readFileSync(file.path);
  const originalSize = file.size;

  // Only compress if the original file is greater than 700 KB
  if (originalSize <= 700 * 1024) {
    return file;
  }

  try {
    // Compress image to approximately 300 KB
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 2000, withoutEnlargement: true })
      .jpeg({
        quality: 99, // Higher quality to maintain more detail
        chromaSubsampling: "4:4:4", // Preserve color details
        progressive: true, // Optimize size while maintaining quality
      })
      .toBuffer();

    // Save compressed buffer to file
    await sharp(compressedBuffer).toFile(compressedFilePath);

    // Create a new file object for the compressed file
    const stats = fs.statSync(compressedFilePath);
    const compressedFile: Express.Multer.File = {
      ...file,
      path: compressedFilePath,
      filename: safeFilename,
      size: stats.size,
      destination: tempDir,
    };

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};
