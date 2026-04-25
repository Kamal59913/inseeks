// import { uploadFilesToLinode } from "../imageUploader";
// import {
//   compressImage,
//   compressImageForOriginal,
// } from "./compressorFunctions/imageCompressor";
// import fs from "fs";

// const uploadImages = async (
//   files: Express.Multer.File[]
// ): Promise<string[]> => {
//   const urls: string[] = [];

//   for (const file of files) {
//     const compressedFile = await compressImageForOriginal(file);
//     // const compressedFile = file;
//     const uploadedImages = await uploadFilesToLinode([compressedFile]);

//     if (uploadedImages.length > 0 && uploadedImages[0].key) {
//       const imageKey = uploadedImages[0].key;
//       const imageUrl = `https://${process.env.BUCKET_NAME}.${process.env.LINODE_REGION}.linodeobjects.com/${imageKey}`;
//       urls.push(imageUrl);

//       // if (fs.existsSync(compressedFile.path)) {
//       //   fs.unlinkSync(compressedFile.path);
//       // }
//     } else {
//       console.log("Image upload failed or no key returned.");
//     }
//   }

//   return urls;
// };

// const uploadMultipleFiles = async (
//   files: Express.Multer.File[]
// ): Promise<
//   { url: string; filename: string; mimetype: string; size: number }[]
// > => {
//   const uploadedFilesData: {
//     url: string;
//     filename: string;
//     mimetype: string;
//     size: number;
//   }[] = [];

//   for (const file of files) {
//     const uploadedFiles = await uploadFilesToLinode([file]);
//     console.log("this is the uploaded files", uploadedFiles)
//     if (uploadedFiles.length > 0 && uploadedFiles[0].key) {
//       const imageKey = uploadedFiles[0].key;
//       const imageUrl = `https://${process.env.BUCKET_NAME}.${process.env.LINODE_REGION}.linodeobjects.com/${imageKey}`;

//       uploadedFilesData.push({
//         url: imageUrl,
//         filename: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size,
//       });
//     } else {
//       console.log("Image upload failed or no key returned.");
//     }
//   }

//   return uploadedFilesData;
// };


// const uploadImagesWithCompressed = async (
//   files: Express.Multer.File[]
// ): Promise<string[]> => {
//   const urls: string[] = [];

//   for (const file of files) {
//     let compressedFile: Express.Multer.File | null = null;

//     try {
//       // Compress the image
//       compressedFile = await compressImage(file);
//       console.log("Here is the compressed file:", compressedFile);

//       // Upload the compressed file
//       const uploadedImages = await uploadFilesToLinode([compressedFile]);

//       if (uploadedImages.length > 0 && uploadedImages[0].key) {
//         const imageKey = uploadedImages[0].key;
//         const imageUrl = `https://${process.env.BUCKET_NAME}.${process.env.LINODE_REGION}.linodeobjects.com/${imageKey}`;
//         urls.push(imageUrl);
//       }
//     } catch (error) {
//       console.error("Error processing image:", error);
//     } finally {
//       // Ensure compressed file is deleted
//       // if (compressedFile && fs.existsSync(compressedFile.path)) {
//       //   try {
//       //     fs.unlinkSync(compressedFile.path);
//       //     console.log(`Deleted compressed file: ${compressedFile.path}`);
//       //   } catch (unlinkError) {
//       //     console.error(
//       //       `Failed to delete compressed file: ${compressedFile.path}`,
//       //       unlinkError
//       //     );
//       //   }
//       // }
//     }
//   }

//   return urls;
// };

// export { uploadImages, uploadImagesWithCompressed, uploadMultipleFiles };
