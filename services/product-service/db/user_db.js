import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectdb = async () => {
  try {
    const c = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected with ${c.connection.host}`);
  } catch (e) {
    console.error("[DB Connection Error]", e.message);
    process.exit(1);
  }
};
