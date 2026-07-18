import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Invalid Authorization" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not Authorized. Invalid token",
      error: error.message,
    });
  }
};

export function authorize(role) {
  return function (req, res, next) {
    if (role !== req.user.role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
