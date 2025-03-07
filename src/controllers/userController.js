const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config()
// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register User
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body; // Accept role in the request

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Only allow role assignment if the first user is being registered
        const isFirstUser = (await User.countDocuments()) === 0;
        const assignedRole = isFirstUser ? "admin" : role || "user"; // First user is admin

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: assignedRole, // Assign the role
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Send role in response
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.message });
    }
};

// @desc    Login User
// @route   POST /api/users/login
// @access  Public
// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (user && (await bcrypt.compare(password, user.password))) {
//             res.json({
//                 _id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 token: generateToken(user.id),
//             });
//         } else {
//             res.status(401).json({ message: "Invalid email or password" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

//modified with cookies

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set token in HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }
};

const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Expire the cookie immediately
    });

    res.json({ message: "Logged out successfully" });
};


// @desc    Get User Profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile,logoutUser };
