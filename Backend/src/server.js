import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";

const startServer = async () => {
  await connectDB();

  const startApp = (port) => {
    const server = app.listen(port, () => {
      logger.info(`Backend server running on http://localhost:${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        const fallbackPort = port + 1;
        logger.warn(`Port ${port} is already in use. Trying port ${fallbackPort}...`);
        startApp(fallbackPort);
      } else {
        throw error;
      }
    });
  };

  startApp(env.port);
};

startServer().catch((error) => {
  logger.error(error);
  process.exit(1);
});