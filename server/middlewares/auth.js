import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const Protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token, exclude password
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "Not authorized, user not found",
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  return res.status(401).json({
    message: "Not authorized, no token",
  });
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied, admin role required",
  });
};

export const ownerOnly = (req, res, next) => {
  if (req.user && (req.user.role === "owner" || req.user.role === "admin")) {
    return next();
  }

  return res.status(403).json({
    message: "Access denied, owner or admin role required",
  });
};