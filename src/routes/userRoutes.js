const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUser,
    deleteAllUsers
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// 🔹 User Profile Management
router.get("/profile", protect, getUserProfile);
router.put("/update-profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

// 🔹 Password Recovery Routes
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword); // ✅ Changed to PUT (update action)

// 🔹 Admin-Only Routes
router.get("/admin/dashboard", protect, adminOnly, (req, res) => {
    res.json({ message: "Admin access granted." }); // ✅ Added response for dashboard access check
});
router.get("/all-users", protect, adminOnly, getAllUsers);
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);
router.delete("/delete-all", protect, adminOnly, deleteAllUsers);

module.exports = router;
