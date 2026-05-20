import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectdb } from "./db/user_db.js";
import userRouter from "./routes/user_routes.js";

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

// The gateway proxies /api/v1/users to here, but without stripping the prefix,
// so the auth service must handle /api/v1/users
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("<h1>Auth Service is working</h1>");
});

app.use((error, req, res, next) => {
  console.error(error.stack || error.message);
  return res.status(error.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message,
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(
    `Auth Service is working at port:${PORT} in ${process.env.NODE_ENV} mode`
  );
});
