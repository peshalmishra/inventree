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

const app = express();

// CORS is handled by the API Gateway

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectdb();

app.use("/api/v1/products", productRouter);
app.use("/api/v1/brands", companyRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Product Service is working</h1>");
});

app.use((error, req, res, next) => {
  console.log(error, error.message);
  return res.status(400).json({ message: "internal server error in product service" });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Product Service is working at port:${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
