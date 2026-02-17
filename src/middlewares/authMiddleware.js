import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });
      if (!req.user) {
        return res
          .status(401)
          .json({ status: "error", message: "User not found" });
      }
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res
        .status(401)
        .json({ status: "error", message: "Not authorized, token failed" });
    }
    if (!token) {
      res
        .status(401)
        .json({ status: "error", message: "Not authorized, no token" });
    }
  }
};
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
