import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

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

// Global CORS configuration for the gateway
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Proxies
app.use(
  "/api/v1/users",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/brands",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/location",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/v1/analytics",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
  })
);
app.get("/", (req, res) => {
  res.send("<h1>API Gateway is working</h1>");
});

app.use((error, req, res, next) => {
  console.log(error, error.message);
  return res.status(500).json({ message: "Gateway error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Gateway is running at port:${PORT} in ${process.env.NODE_ENV} mode`
  );
});
