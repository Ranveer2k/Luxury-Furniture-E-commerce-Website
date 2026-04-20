import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { sendSuccess } from "../utils/response.js";

const buildAuthPayload = (user) => ({
  token: signToken({ id: user._id, role: user.role }),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    addresses: user.addresses,
  },
});

export const register = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email.toLowerCase() });

  if (existing) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  });

  sendSuccess(res, 201, "User registered successfully", buildAuthPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select(
    "+password",
  );

  if (!user || !(await user.matchPassword(req.body.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  sendSuccess(res, 200, "Login successful", buildAuthPayload(user));
});

export const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Profile fetched successfully", { user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.email && { email: req.body.email.toLowerCase() }),
    },
    { new: true, runValidators: true },
  );

  sendSuccess(res, 200, "Profile updated successfully", { user });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(req.body.currentPassword))) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = req.body.newPassword;
  await user.save();

  sendSuccess(res, 200, "Password updated successfully", {
    token: signToken({ id: user._id, role: user.role }),
  });
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = req.body;

  if (address.isDefault) {
    user.addresses.forEach((entry) => {
      entry.isDefault = false;
    });
  }

  user.addresses.push(address);
  await user.save();

  sendSuccess(res, 201, "Address added successfully", { addresses: user.addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (req.body.isDefault) {
    user.addresses.forEach((entry) => {
      entry.isDefault = false;
    });
  }

  Object.assign(address, req.body);
  await user.save();

  sendSuccess(res, 200, "Address updated successfully", { addresses: user.addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    (address) => address._id.toString() !== req.params.addressId,
  );
  await user.save();

  sendSuccess(res, 200, "Address deleted successfully", { addresses: user.addresses });
});