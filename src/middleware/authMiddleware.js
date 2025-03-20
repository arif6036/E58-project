const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ✅ Generate Token and Set Cookie
const generateTokenResponse = (user, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // Only in HTTPS
        sameSite: "Strict", // Protects against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

    return token;
};

const protect = async (req, res, next) => {
    try {
        let token;

        // ✅ Ensure req.cookies exists before accessing it
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        // ✅ Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};


// ✅ Middleware to Check Admin Role
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    } 
    return res.status(403).json({ message: "Access denied, admin only" });
};

module.exports = { protect, adminOnly, generateTokenResponse };
