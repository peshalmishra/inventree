import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectdb } from "./db/user_db.js";
import userRouter from "./routes/user_routes.js";

dotenv.config();

const app = express();

// CORS is handled by the API Gateway

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectdb();

// The gateway proxies /api/v1/users to here, but without stripping the prefix,
// so the auth service must handle /api/v1/users
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("<h1>Auth Service is working</h1>");
});

app.use((error, req, res, next) => {
  console.log(error, error.message);
  return res.status(400).json({ message: "internal server error in auth service" });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Auth Service is working at port:${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
