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
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "user is not found or Login first",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // Since we don't have access to the User DB directly here,
    // we attach the decoded payload (like _id) to req.user.
    // If the token is valid, they are authenticated.
    req.user = { _id: decode._id, role: decode.role }; 
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
