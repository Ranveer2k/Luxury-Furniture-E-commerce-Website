import crypto from "node:crypto";

import Razorpay from "razorpay";
import Stripe from "stripe";

import env from "./env.js";

export const stripeClient = env.stripe.secretKey
  ? new Stripe(env.stripe.secretKey, {
      apiVersion: env.stripe.apiVersion,
    })
  : null;

export const razorpayClient =
  env.razorpay.keyId && env.razorpay.keySecret
    ? new Razorpay({
        key_id: env.razorpay.keyId,
        key_secret: env.razorpay.keySecret,
      })
    : null;

export const verifyRazorpaySignature = ({
  orderId,
  paymentId,
  signature,
}) => {
  const digest = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return digest === signature;
};