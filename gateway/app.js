import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

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

app.listen(process.env.PORT, () => {
  console.log(
    `Gateway is running at port:${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
