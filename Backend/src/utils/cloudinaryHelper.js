import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";
import logger from "./logger.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

/**
 * Upload image to Cloudinary from URL
 */
export async function uploadImageFromUrl(imageUrl, folder = "luxury-furniture", publicId) {
  try {
    const uploadOptions = {
      folder,
      resource_type: "image",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" }
      ]
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(imageUrl, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    logger.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Upload multiple images from URLs
 */
export async function uploadMultipleImages(imageUrls, folder = "luxury-furniture", onProgress) {
  const uploadedImages = [];
  let completed = 0;

  for (const imageUrl of imageUrls) {
    try {
      const result = await uploadImageFromUrl(imageUrl, folder);
      uploadedImages.push(result);

      completed++;
      if (onProgress) {
        onProgress(completed, imageUrls.length);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      logger.error(`Failed to upload image ${imageUrl}:`, error.message);
      // Continue with other images
    }
  }

  return uploadedImages;
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error("Cloudinary delete error:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Delete multiple images from Cloudinary
 */
export async function deleteMultipleImages(publicIds) {
  const deletePromises = publicIds.map(publicId => deleteImage(publicId));
  return Promise.allSettled(deletePromises);
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(publicId, options = {}) {
  const defaultOptions = {
    width: 800,
    height: 800,
    crop: "fill",
    quality: "auto",
    format: "auto",
    ...options
  };

  return cloudinary.url(publicId, defaultOptions);
}

/**
 * Generate thumbnail URL
 */
export function getThumbnailUrl(publicId, size = 300) {
  return cloudinary.url(publicId, {
    width: size,
    height: size,
    crop: "fill",
    quality: "auto",
    format: "auto"
  });
}

/**
 * Get image info
 */
export async function getImageInfo(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    logger.error("Cloudinary info error:", error);
    throw new Error(`Failed to get image info: ${error.message}`);
  }
}

/**
 * Auto-tag image using Cloudinary AI
 */
export async function autoTagImage(publicId) {
  try {
    const result = await cloudinary.uploader.upload(publicId, {
      resource_type: "image",
      categorization: "google_tagging",
      auto_tagging: 0.6
    });

    return result.tags || [];
  } catch (error) {
    logger.error("Cloudinary auto-tagging error:", error);
    return [];
  }
}

/**
 * Create image transformation presets for different use cases
 */
export const IMAGE_PRESETS = {
  thumbnail: { width: 300, height: 300, crop: "fill" },
  medium: { width: 600, height: 600, crop: "fill" },
  large: { width: 1200, height: 1200, crop: "fill" },
  hero: { width: 1920, height: 1080, crop: "fill" },
  gallery: { width: 800, height: 600, crop: "fill" }
};

/**
 * Apply preset transformation
 */
export function applyPreset(publicId, presetName) {
  const preset = IMAGE_PRESETS[presetName];
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }

  return cloudinary.url(publicId, {
    ...preset,
    quality: "auto",
    format: "auto"
  });
}

export default {
  uploadImageFromUrl,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getOptimizedImageUrl,
  getThumbnailUrl,
  getImageInfo,
  autoTagImage,
  applyPreset,
  IMAGE_PRESETS
};