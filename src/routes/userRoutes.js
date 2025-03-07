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
    deleteUser
} = require("../controllers/userController");

const { protect,adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// User Profile Management
router.get("/profile", protect, getUserProfile);
router.put("/update-profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

// Password Recovery Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Admin-Only Routes
router.get("/admin/dashboard", protect, adminOnly);
router.get("/all-users", protect, adminOnly, getAllUsers);
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);



module.exports = router;
 
