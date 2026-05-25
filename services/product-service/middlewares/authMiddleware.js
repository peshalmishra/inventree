import jwt from "jsonwebtoken";

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
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { _id: decoded._id, role: decoded.role }; 
    next();
  } catch (error) {
    console.error("[Auth Error]", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};
