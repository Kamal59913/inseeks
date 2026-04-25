export const formatImages = (files: Express.Multer.File[] = []) => {
  return files.map((file) => ({
    original: {
      url: `/public/temp/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    },
    thumbnail: {
      url: `/public/temp/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    },
  }));
};