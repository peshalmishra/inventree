import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectdb } from "./db/user_db.js";
import productRouter from "./routes/productRoutes.js";
import companyRouter from "./routes/companyRoutes.js";
import locationRouter from "./routes/locationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import "./models/user_model.js";

dotenv.config();

// Catch any uncaught startup errors so Render logs show the real reason
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
  process.exit(1);
});

const app = express();

// CORS is handled by the API Gateway

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectdb();

// health check endpoint (keep before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/api/v1/products", productRouter);
app.use("/api/v1/brands", companyRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Product Service is working</h1>");
});

app.use((error, req, res, next) => {
  console.error(error.stack || error.message);
  return res.status(error.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message,
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(
    `Product Service is working at port:${PORT} in ${process.env.NODE_ENV} mode`
  );
});
