import axios from "axios";
import env from "../config/env.js";
import logger from "./logger.js";

// Image API configurations
const UNSPLASH_BASE_URL = "https://api.unsplash.com";
const PEXELS_BASE_URL = "https://api.pexels.com/v1";

// Category search queries for high-quality, premium luxury furniture images
const CATEGORY_QUERIES = {
  "wood-furniture": [
    "luxury wooden furniture showroom",
    "premium handcrafted wood furniture",
    "high end wooden furniture interior",
    "designer solid wood furniture",
    "luxury teak furniture",
    "mahogany furniture premium",
    "oak wood furniture luxury",
    "walnut furniture modern",
    "bespoke wooden furniture",
    "artisan wood furniture",
    "contemporary wooden furniture",
    "minimalist wood furniture"
  ],
  "epoxy-furniture": [
    "luxury epoxy resin furniture",
    "premium resin table design",
    "high end epoxy furniture",
    "designer resin furniture",
    "epoxy resin dining table luxury",
    "resin coffee table premium",
    "epoxy furniture showroom",
    "resin furniture modern",
    "epoxy resin art furniture",
    "luxury resin furniture interior",
    "epoxy resin furniture design",
    "premium resin furniture"
  ],
  "chairs": [
    "luxury designer chair",
    "premium armchair leather",
    "high end modern chair",
    "designer chair showroom",
    "luxury chair interior",
    "premium dining chair",
    "designer chair contemporary",
    "luxury chair furniture",
    "high end chair design",
    "premium chair collection",
    "designer chair modern",
    "luxury chair leather"
  ],
  "beds": [
    "luxury bed frame design",
    "premium king size bed",
    "high end bedroom furniture",
    "designer bed showroom",
    "luxury wooden bed frame",
    "premium platform bed",
    "designer bed contemporary",
    "luxury bed interior",
    "high end bed design",
    "premium upholstered bed",
    "designer bed modern",
    "luxury bed collection"
  ],
  "sofas": [
    "luxury designer sofa",
    "premium leather sofa",
    "high end sectional sofa",
    "designer sofa showroom",
    "luxury sofa interior",
    "premium sofa collection",
    "designer sofa modern",
    "luxury sofa leather",
    "high end sofa design",
    "premium sofa furniture",
    "designer sofa contemporary",
    "luxury sofa collection"
  ],
  "tables": [
    "luxury dining table design",
    "premium coffee table",
    "high end side table",
    "designer table showroom",
    "luxury table interior",
    "premium console table",
    "designer table modern",
    "luxury table furniture",
    "high end table design",
    "premium table collection",
    "designer table contemporary",
    "luxury table design"
  ],
  "doors": [
    "luxury wooden door design",
    "premium interior door",
    "high end wooden door",
    "designer door showroom",
    "luxury door interior",
    "premium carved door",
    "designer door modern",
    "luxury door furniture",
    "high end door design",
    "premium door collection",
    "designer door contemporary",
    "luxury door design"
  ],
  "epoxy-art-products": [
    "luxury epoxy resin art",
    "premium resin art piece",
    "high end resin decor",
    "designer epoxy art",
    "luxury resin wall art",
    "premium epoxy jewelry",
    "designer resin art",
    "luxury epoxy decor",
    "high end resin art",
    "premium resin sculpture",
    "designer epoxy art",
    "luxury resin art collection"
  ]
};

/**
 * Fetch images from Unsplash API with premium quality filters
 */
async function fetchFromUnsplash(query, count = 30) {
  try {
    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: {
        query,
        per_page: Math.min(count, 30), // Unsplash max is 30 per request
        orientation: "landscape",
        content_filter: "high",
        order_by: "relevant"
      },
      headers: {
        Authorization: `Client-ID ${env.unsplash.accessKey}`
      }
    });

    // Filter for high-quality images
    const filteredResults = response.data.results.filter(photo => {
      // Check for high resolution (at least 2000px width)
      if (photo.width < 2000) return false;

      // Check for good aspect ratio (not too extreme)
      const aspectRatio = photo.width / photo.height;
      if (aspectRatio < 0.8 || aspectRatio > 2.5) return false;

      // Prefer images with good descriptions
      if (!photo.description && !photo.alt_description) return false;

      // Avoid very old or low-quality images
      const uploadDate = new Date(photo.created_at);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      if (uploadDate < oneYearAgo) return false;

      return true;
    });

    return filteredResults.slice(0, count).map(photo => ({
      url: photo.urls.regular, // High quality but not full resolution
      fullUrl: photo.urls.full, // Maximum quality
      thumbUrl: photo.urls.thumb,
      alt: photo.alt_description || photo.description || `${query} luxury furniture`,
      photographer: photo.user.name,
      unsplashId: photo.id,
      width: photo.width,
      height: photo.height,
      likes: photo.likes,
      tags: photo.tags ? photo.tags.map(tag => tag.title) : [],
      color: photo.color,
      createdAt: photo.created_at
    }));
  } catch (error) {
    logger.error(`Unsplash API error for query "${query}":`, error.message);
    return [];
  }
}

/**
 * Fetch images from Pexels API with premium quality filters
 */
async function fetchFromPexels(query, count = 30) {
  try {
    const response = await axios.get(`${PEXELS_BASE_URL}/search`, {
      params: {
        query,
        per_page: Math.min(count, 30), // Pexels max is 30 per request
        orientation: "landscape",
        size: "large",
        locale: "en-US"
      },
      headers: {
        Authorization: env.pexels.apiKey
      }
    });

    // Filter for high-quality images
    const filteredResults = response.data.photos.filter(photo => {
      // Check for high resolution (at least 2000px width)
      if (photo.width < 2000) return false;

      // Check for good aspect ratio
      const aspectRatio = photo.width / photo.height;
      if (aspectRatio < 0.8 || aspectRatio > 2.5) return false;

      // Prefer images with good descriptions
      if (!photo.alt) return false;

      return true;
    });

    return filteredResults.slice(0, count).map(photo => ({
      url: photo.src.large, // High quality
      fullUrl: photo.src.original, // Maximum quality
      thumbUrl: photo.src.medium,
      alt: photo.alt || `${query} luxury furniture`,
      photographer: photo.photographer,
      pexelsId: photo.id,
      width: photo.width,
      height: photo.height,
      likes: 0, // Pexels doesn't provide likes
      tags: [], // Pexels doesn't provide tags
      color: null,
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    logger.error(`Pexels API error for query "${query}":`, error.message);
    return [];
  }
}

/**
 * Fetch images from multiple sources and combine results
 */
async function fetchImagesFromMultipleSources(queries, totalCount = 50) {
  const allImages = [];
  const imagesPerQuery = Math.ceil(totalCount / queries.length);

  for (const query of queries) {
    try {
      // Try Unsplash first
      if (env.unsplash.accessKey) {
        const unsplashImages = await fetchFromUnsplash(query, imagesPerQuery);
        allImages.push(...unsplashImages);
      }

      // Then try Pexels
      if (env.pexels.apiKey && allImages.length < totalCount) {
        const remaining = totalCount - allImages.length;
        const pexelsImages = await fetchFromPexels(query, remaining);
        allImages.push(...pexelsImages);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      logger.error(`Error fetching images for query "${query}":`, error.message);
    }
  }

  // Remove duplicates based on URL
  const uniqueImages = allImages.filter((image, index, self) =>
    index === self.findIndex(img => img.url === image.url)
  );

  // Shuffle and limit to requested count
  const shuffled = uniqueImages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, totalCount);
}

/**
 * Main function to fetch high-quality images for a category
 * Ensures at least 10-20 unique premium images per category
 */
export async function fetchImages(category, count = 20) {
  if (!CATEGORY_QUERIES[category]) {
    throw new Error(`Invalid category: ${category}. Valid categories: ${Object.keys(CATEGORY_QUERIES).join(", ")}`);
  }

  const queries = CATEGORY_QUERIES[category];
  logger.info(`Fetching ${count} premium images for category "${category}" using ${queries.length} search queries`);

  const allImages = [];
  const imagesPerQuery = Math.max(5, Math.ceil(count / queries.length));

  // Fetch from multiple queries to ensure variety
  for (const query of queries) {
    try {
      // Try Unsplash first (preferred for quality)
      if (env.unsplash.accessKey) {
        const unsplashImages = await fetchFromUnsplash(query, imagesPerQuery);
        allImages.push(...unsplashImages);
      }

      // Fallback to Pexels if needed
      if (env.pexels.apiKey && allImages.length < count) {
        const remaining = Math.max(3, count - allImages.length);
        const pexelsImages = await fetchFromPexels(query, remaining);
        allImages.push(...pexelsImages);
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Break if we have enough images
      if (allImages.length >= count) break;

    } catch (error) {
      logger.error(`Error fetching images for query "${query}":`, error.message);
    }
  }

  // Remove duplicates based on URL and ensure quality
  const uniqueImages = allImages
    .filter((image, index, self) =>
      index === self.findIndex(img => img.url === image.url)
    )
    .filter(image => {
      // Additional quality filters
      return image.width >= 2000 && image.height >= 1500;
    })
    .sort((a, b) => {
      // Sort by quality (likes, resolution, recency)
      const scoreA = (a.likes || 0) + (a.width * a.height / 1000000) + (new Date(a.createdAt).getTime() / 1000000000);
      const scoreB = (b.likes || 0) + (b.width * b.height / 1000000) + (new Date(b.createdAt).getTime() / 1000000000);
      return scoreB - scoreA;
    });

  const finalImages = uniqueImages.slice(0, Math.max(count, 10)); // At least 10 images

  if (finalImages.length === 0) {
    throw new Error(`No high-quality images found for category "${category}". Please check API keys and network connection.`);
  }

  logger.info(`Successfully fetched ${finalImages.length} premium images for category "${category}"`);
  return finalImages;
}

/**
 * Get all available categories
 */
export function getAvailableCategories() {
  return Object.keys(CATEGORY_QUERIES);
}

/**
 * Validate category
 */
export function isValidCategory(category) {
  return category in CATEGORY_QUERIES;
}

export default {
  fetchImages,
  getAvailableCategories,
  isValidCategory,
  CATEGORY_QUERIES
};