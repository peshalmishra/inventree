import User from "../models/user_model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
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
        message: "Not authenticated. Please login first.",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decode._id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};
