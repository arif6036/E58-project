const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require('dotenv').config()

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body; 
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
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  
  

const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(1), // Expire the cookie immediately
    });

    res.json({ message: "Logged out successfully" });
};


const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields (only if provided)
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;

        // Update password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            message: "Profile updated successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash New Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: "Password has been reset successfully. You can now log in with your new password." });

    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};


// Forgot Password Function
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Forgot Password Function
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Reset Token (expires in 1 hour)
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Use Frontend URL for Reset Link
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`; //local host front end

        // Send Email
        await transporter.sendMail({
            from: `"Event Management" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <p>Hello ${user.name},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetLink}" style="background: #007bff; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
            `,
        });

        res.json({ message: "Password reset email sent. Please check your inbox." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords for security
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent Admins from Deleting Themselves
        if (req.user.id === user.id) {
            return res.status(400).json({ message: "You cannot delete your own account" });
        }

        await user.deleteOne();

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// ✅ Delete All Users (Admin Only)
const deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.status(200).json({ message: "All users have been deleted", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    updateUserProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUser,
    deleteAllUsers
};
