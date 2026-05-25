import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    } else if (parts.length === 1) {
      token = parts[0];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }
    next();
  } catch (error) {
    console.error("[Auth Error]", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};
