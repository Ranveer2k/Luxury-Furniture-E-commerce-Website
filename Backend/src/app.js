import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import env from "./config/env.js";
import swaggerSpec from "./config/swagger.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import routes from "./routes/index.js";
import logger from "./utils/logger.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost origins for development
      if (origin.includes('localhost')) return callback(null, true);

      // Check against allowed origins
      if (env.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', env.allowedOrigins);
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Aurelle Maison API",
    version: "1.0.0",
    docs: "/api/docs",
    health: "/health",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      cart: "/api/cart",
      wishlist: "/api/wishlist",
      orders: "/api/orders",
      payments: "/api/payments",
      reviews: "/api/reviews",
      admin: "/api/admin"
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Aurelle Maison backend is healthy",
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;