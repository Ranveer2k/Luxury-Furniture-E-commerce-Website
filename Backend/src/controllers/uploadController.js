import streamifier from "node:stream";

import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "aurelle-maison/products" },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      },
    );

    streamifier.Readable.from(buffer).pipe(uploadStream);
  });

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    throw new ApiError(400, "At least one image is required");
  }

  const results = await Promise.all(
    req.files.map(async (file) => {
      const result = await uploadBuffer(file.buffer);
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }),
  );

  sendSuccess(res, 200, "Images uploaded successfully", { images: results });
});