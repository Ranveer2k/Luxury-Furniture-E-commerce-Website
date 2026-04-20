import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate("items.product");
  }

  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  sendSuccess(res, 200, "Cart fetched successfully", { cart });
});

export const addOrUpdateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stockQuantity < quantity) {
    throw new ApiError(400, "Requested quantity exceeds available stock");
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (item) => item.product._id.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity = quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate("items.product");

  sendSuccess(res, 200, "Cart updated successfully", { cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter(
    (item) => item.product._id.toString() !== req.params.productId,
  );
  await cart.save();
  await cart.populate("items.product");

  sendSuccess(res, 200, "Item removed from cart", { cart });
});