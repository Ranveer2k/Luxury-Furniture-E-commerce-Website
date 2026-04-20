import mongoose from "mongoose";

import env from "./env.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  await mongoose.connect(env.mongodbUri);
  logger.info("MongoDB connected");
};

export default connectDB;