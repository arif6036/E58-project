const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]; // Extract token
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (exclude password)
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next(); // Move to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, invalid token", error: error.message });
    }
};

// Middleware to check admin role
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next(); // Move to the next middleware
    } else {
        return res.status(403).json({ message: "Access denied, admin only" });
    }
};

module.exports = { protect, adminOnly };
