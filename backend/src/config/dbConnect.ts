import mongoose from "mongoose";
import { config } from "dotenv";

config();

const buildMongoUrl = (rawUrl: string, dbName: string) => {
  if (!rawUrl) {
    throw new Error("Mongo connection string is not defined.");
  }

  const parsedUrl = new URL(rawUrl);
  const normalizedDbName = dbName.replace(/^\/+/, "");

  parsedUrl.pathname = `/${normalizedDbName}`;

  return parsedUrl.toString();
};

const dbConnect = async () => {
  const baseUrl = process.env.MONGODB_URI || process.env.MONGO_URL || "";
  const dbName = process.env.DB_NAME || "kamalandcode";
  const url = buildMongoUrl(baseUrl, dbName);

  try {
    const connection = await mongoose.connect(url);
    console.log(
      `MongoDB connected successfully. Host: ${connection.connection.host}, Database: ${connection.connection.name}`,
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

export default dbConnect;
