import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "my-crud-app",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("MongoDB Connected Successfully!");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
