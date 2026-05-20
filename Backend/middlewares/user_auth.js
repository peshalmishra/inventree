import User from "../models/user_model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    } else if (parts.length === 1) {
      token = parts[0];
    }
  }

  console.log("token", token);
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "user is not found or Login first",
    });
  }

  const decode = jwt.verify(token, process.env.SECRET_KEY);

  req.user = await User.findById(decode._id);
  next();
};
