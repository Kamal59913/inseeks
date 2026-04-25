import mongoose from "mongoose";
import { config } from "dotenv";

config();

const dbConnect = async () => {
  const baseUrl = process.env.MONGODB_URI || process.env.MONGO_URL || "";
  const dbName = process.env.DB_NAME || "kamalandcode";
  const url =
    process.env.MONGO_URL && !process.env.MONGODB_URI
      ? process.env.MONGO_URL
      : `${baseUrl}/${dbName}`;

  if (!url) {
    throw new Error("Mongo connection string is not defined.");
  }

  try {
    const connection = await mongoose.connect(url);
    console.log(
      `MongoDB connected successfully. Host: ${connection.connection.host}`,
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export default dbConnect;
