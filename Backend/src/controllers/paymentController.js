import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import {
  razorpayClient,
  stripeClient,
  verifyRazorpaySignature,
} from "../config/payments.js";

export const createStripeCheckoutSession = asyncHandler(async (req, res) => {
  if (!stripeClient) {
    throw new ApiError(500, "Stripe is not configured");
  }

  const order = await Order.findById(req.body.orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    success_url: `${req.body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: req.body.cancelUrl,
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
    })),
    metadata: {
      orderId: order._id.toString(),
    },
  });

  sendSuccess(res, 200, "Stripe checkout session created", {
    sessionId: session.id,
    url: session.url,
  });
});

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!razorpayClient) {
    throw new ApiError(500, "Razorpay is not configured");
  }

  const order = await Order.findById(req.body.orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const razorpayOrder = await razorpayClient.orders.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "INR",
    receipt: order._id.toString(),
  });

  order.paymentReference = razorpayOrder.id;
  await order.save();

  sendSuccess(res, 200, "Razorpay order created", {
    razorpayOrder,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { provider } = req.body;

  if (provider === "stripe") {
    if (!stripeClient) {
      throw new ApiError(500, "Stripe is not configured");
    }

    const session = await stripeClient.checkout.sessions.retrieve(req.body.sessionId);
    const order = await Order.findById(req.body.orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (session.payment_status !== "paid") {
      throw new ApiError(400, "Stripe session is not paid");
    }

    order.paymentStatus = "paid";
    order.paymentReference = session.payment_intent || session.id;
    order.orderStatus = "processing";
    await order.save();

    return sendSuccess(res, 200, "Stripe payment verified successfully", { order });
  }

  const isValid = verifyRazorpaySignature({
    orderId: req.body.razorpayOrderId,
    paymentId: req.body.razorpayPaymentId,
    signature: req.body.razorpaySignature,
  });

  if (!isValid) {
    throw new ApiError(400, "Invalid Razorpay signature");
  }

  const order = await Order.findById(req.body.orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = "paid";
  order.paymentReference = req.body.razorpayPaymentId;
  order.orderStatus = "processing";
  await order.save();

  sendSuccess(res, 200, "Razorpay payment verified successfully", { order });
});