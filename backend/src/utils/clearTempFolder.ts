import fs from "fs";
import path from "path";

const tempFolderPath = path.join(__dirname, "../public/temp");

export const clearTempFolder = () => {
  try {
    fs.readdir(tempFolderPath, (err, files) => {
      if (err) {
        console.error("Error reading temp folder:", err);
        return;
      }

      for (const file of files) {
        const filePath = path.join(tempFolderPath, file);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Failed to delete ${filePath}:`, unlinkErr);
          } else {
            console.log(`Deleted: ${filePath}`);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error emptying temp folder:", error);
  }
};
