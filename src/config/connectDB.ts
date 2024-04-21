import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async () => {
  try {
    const res = await mongoose.connect(config.mongoURI as string);
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
