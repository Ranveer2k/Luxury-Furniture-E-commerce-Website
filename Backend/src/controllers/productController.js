import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import { uploadImageFromUrl, deleteImage, getOptimizedImageUrl } from "../utils/cloudinaryHelper.js";
import { fetchImages } from "../utils/imageFetcher.js";

const buildFilters = (query) => {
  const filters = { isActive: true };

  if (query.category) filters.category = query.category;
  if (query.material) filters.material = query.material;

  if (query.minPrice || query.maxPrice) {
    filters.finalPrice = {};
    if (query.minPrice) filters.finalPrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.finalPrice.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filters.$text = { $search: query.search };
  }

  if (query.tags) {
    filters.tags = { $in: query.tags.split(',') };
  }

  return filters;
};

const buildSort = (sort) => {
  switch (sort) {
    case "price_asc": return { finalPrice: 1 };
    case "price_desc": return { finalPrice: -1 };
    case "rating": return { ratingsAverage: -1 };
    case "popularity": return { popularityScore: -1 };
    case "newest": return { createdAt: -1 };
    default: return { popularityScore: -1, ratingsAverage: -1, createdAt: -1 };
  }
};

// Get products with advanced filtering and pagination
export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const skip = (page - 1) * limit;
  const filters = buildFilters(req.query);
  const sort = buildSort(req.query.sort);

  // Select fields based on request (detailed or summary)
  const selectFields = req.query.detailed === 'true'
    ? null // All fields
    : 'name price discountPrice images thumbnail ratingsAverage ratingsCount category material tags dimensions';

  const [products, total] = await Promise.all([
    Product.find(filters).select(selectFields).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filters),
  ]);

  // Add virtual finalPrice to products
  const productsWithVirtuals = products.map(product => ({
    ...product.toObject(),
    finalPrice: product.finalPrice
  }));

  sendSuccess(res, 200, "Products fetched successfully", {
    products: productsWithVirtuals,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// Get single product with full details
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Increment popularity score
  await Product.findByIdAndUpdate(req.params.id, {
    $inc: { popularityScore: 1 }
  });

  sendSuccess(res, 200, "Product fetched successfully", {
    product: {
      ...product.toObject(),
      finalPrice: product.finalPrice
    }
  });
});

// Create product (admin only)
export const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;

  // Validate images
  if (!productData.images || productData.images.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  // Ensure only one primary image
  const primaryImages = productData.images.filter(img => img.isPrimary);
  if (primaryImages.length > 1) {
    throw new ApiError(400, "Only one image can be marked as primary");
  }

  // Set first image as primary if none specified
  if (primaryImages.length === 0 && productData.images.length > 0) {
    productData.images[0].isPrimary = true;
  }

  // Generate thumbnail from primary image
  const primaryImage = productData.images.find(img => img.isPrimary);
  if (primaryImage && primaryImage.publicId) {
    productData.thumbnail = {
      url: getOptimizedImageUrl(primaryImage.publicId, { width: 300, height: 300 }),
      publicId: primaryImage.publicId
    };
  }

  const product = await Product.create(productData);
  sendSuccess(res, 201, "Product created successfully", {
    product: {
      ...product.toObject(),
      finalPrice: product.finalPrice
    }
  });
});

// Update product (admin only)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  sendSuccess(res, 200, "Product updated successfully", {
    product: {
      ...product.toObject(),
      finalPrice: product.finalPrice
    }
  });
});

// Delete product (admin only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Optionally delete images from Cloudinary
  if (req.query.deleteImages === 'true') {
    const publicIds = product.images.map(img => img.publicId).filter(Boolean);
    await Promise.allSettled(publicIds.map(id => deleteImage(id)));
  }

  sendSuccess(res, 200, "Product deleted successfully");
});

// Get products by category
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const limit = Number(req.query.limit || 20);

  const products = await Product.getProductsByCategory(category, limit);

  sendSuccess(res, 200, "Products fetched successfully", { products });
});

// Get available categories with image counts
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalImages: { $sum: { $size: "$images" } },
        avgPrice: { $avg: "$price" },
        avgRating: { $avg: "$ratingsAverage" }
      }
    },
    {
      $project: {
        category: "$_id",
        count: 1,
        totalImages: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
        avgRating: { $round: ["$avgRating", 1] },
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);

  sendSuccess(res, 200, "Categories fetched successfully", { categories });
});

// Add images to existing product
export const addProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { imageUrls, tags } = req.body;

  if (!imageUrls || !Array.isArray(imageUrls)) {
    throw new ApiError(400, "imageUrls array is required");
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Upload images to Cloudinary
  const uploadedImages = [];
  for (const url of imageUrls) {
    try {
      const uploaded = await uploadImageFromUrl(url, `luxury-furniture/${product.category}`);
      uploadedImages.push({
        url: uploaded.url,
        publicId: uploaded.publicId,
        alt: `Product image ${product.images.length + uploadedImages.length + 1}`,
        tags: tags || []
      });
    } catch (error) {
      // Continue with other images
    }
  }

  // Add to product
  product.images.push(...uploadedImages);
  await product.save();

  sendSuccess(res, 200, "Images added successfully", {
    product,
    imagesAdded: uploadedImages.length
  });
});

// Remove image from product
export const removeProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
  if (imageIndex === -1) {
    throw new ApiError(404, "Image not found");
  }

  const image = product.images[imageIndex];

  // Delete from Cloudinary if requested
  if (req.query.deleteFromCloudinary === 'true' && image.publicId) {
    await deleteImage(image.publicId);
  }

  // Remove from product
  product.images.splice(imageIndex, 1);
  await product.save();

  sendSuccess(res, 200, "Image removed successfully", { product });
});

// Set primary image
export const setPrimaryImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Reset all images to non-primary
  product.images.forEach(img => img.isPrimary = false);

  // Set specified image as primary
  const image = product.images.find(img => img._id.toString() === imageId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  image.isPrimary = true;

  // Update thumbnail
  product.thumbnail = {
    url: getOptimizedImageUrl(image.publicId, { width: 300, height: 300 }),
    publicId: image.publicId
  };

  await product.save();

  sendSuccess(res, 200, "Primary image updated successfully", { product });
});

// Search products with advanced filters
export const searchProducts = asyncHandler(async (req, res) => {
  const { q, category, material, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

  const filters = { isActive: true };

  if (q) {
    filters.$text = { $search: q };
  }

  if (category) filters.category = category;
  if (material) filters.material = material;

  if (minPrice || maxPrice) {
    filters.finalPrice = {};
    if (minPrice) filters.finalPrice.$gte = Number(minPrice);
    if (maxPrice) filters.finalPrice.$lte = Number(maxPrice);
  }

  const sortOptions = buildSort(sort);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .select('name price discountPrice images thumbnail ratingsAverage ratingsCount category material')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filters)
  ]);

  sendSuccess(res, 200, "Search results fetched successfully", {
    products: products.map(p => ({ ...p.toObject(), finalPrice: p.finalPrice })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    searchQuery: q
  });
});

// Get product recommendations
export const getRecommendations = asyncHandler(async (req, res) => {
  const { category, excludeId, limit = 6 } = req.query;

  const filters = { isActive: true };
  if (category) filters.category = category;
  if (excludeId) filters._id = { $ne: excludeId };

  const products = await Product.find(filters)
    .select('name price discountPrice images thumbnail ratingsAverage ratingsCount category material')
    .sort({ popularityScore: -1, ratingsAverage: -1 })
    .limit(Number(limit));

  sendSuccess(res, 200, "Recommendations fetched successfully", {
    products: products.map(p => ({ ...p.toObject(), finalPrice: p.finalPrice }))
  });
});