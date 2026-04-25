// import { uploadFilesToLinode } from "../imageUploader";

// const uploadDocuments = async (
//   files: Express.Multer.File[]
// ): Promise<string[]> => {
//   const documents: string[] = [];

//   for (const file of files) {
//     const documentsPath = file;

//     // Use your Linode upload function here
//     const uploadedDocuments = await uploadFilesToLinode([documentsPath]);

//     // Check if upload was successful and retrieve the URL
//     if (uploadedDocuments.length > 0 && uploadedDocuments[0].key) {
//       const docKey = uploadedDocuments[0].key;
//       // console.log(imageKey, "linode");

//       // Construct the image URL using environment variables
//       const docUrl = `https://${process.env.BUCKET_NAME}.${process.env.LINODE_REGION}.linodeobjects.com/${docKey}`;
//       documents.push(docUrl);
//     } else {
//       console.log("Image upload failed or no key returned.");
//     }
//   }

//   return documents;
// };

// export { uploadDocuments };