import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    wishlist = await Wishlist.findById(wishlist._id).populate("products");
  }

  return wishlist;
};

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  sendSuccess(res, 200, "Wishlist fetched successfully", { wishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.products.some((item) => item._id.toString() === productId);

  if (exists) {
    wishlist.products = wishlist.products.filter(
      (item) => item._id.toString() !== productId,
    );
  } else {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  await wishlist.populate("products");

  sendSuccess(res, 200, "Wishlist updated successfully", { wishlist });
});