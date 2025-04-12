import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const ecologistOnly = (req, res, next) => {
  if (req.user && req.user.role === "ecologist") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Ecologist role required" });
  }
};
