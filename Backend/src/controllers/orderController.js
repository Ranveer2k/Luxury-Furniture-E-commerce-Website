import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

const populateCart = (userId) =>
  Cart.findOne({ user: userId }).populate("items.product");

export const createOrderFromCart = asyncHandler(async (req, res) => {
  const cart = await populateCart(req.user._id);

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const items = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0]?.url,
    price: item.product.discountPrice || item.product.price,
    quantity: item.quantity,
  }));

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    shippingAddress: req.body.shippingAddress,
    paymentProvider: req.body.paymentProvider,
  });

  sendSuccess(res, 201, "Order created successfully", { order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  sendSuccess(res, 200, "Order history fetched successfully", { orders });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, "Orders fetched successfully", { orders });
});

export const markOrderPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = "paid";
  order.paymentReference = req.body.paymentReference;
  order.orderStatus = "processing";
  await order.save();

  const productBulkUpdates = order.items.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: {
        $inc: {
          stockQuantity: -item.quantity,
          popularityScore: item.quantity,
        },
      },
    },
  }));

  if (productBulkUpdates.length) {
    await Product.bulkWrite(productBulkUpdates);
  }

  await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

  sendSuccess(res, 200, "Order marked as paid", { order });
});