import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyJWT = async (req, res, next) => {
  try {
    console.log("HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("DECODED:", decoded);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Token expired" });
  }
};