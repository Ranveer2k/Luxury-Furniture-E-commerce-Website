import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, productsCount, revenueStats] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]),
  ]);

  sendSuccess(res, 200, "Dashboard stats fetched successfully", {
    stats: {
      totalUsers,
      totalOrders,
      productsCount,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  sendSuccess(res, 200, "Users fetched successfully", { users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  sendSuccess(res, 200, "User updated successfully", { user });
});