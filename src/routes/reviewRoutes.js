const express = require("express");
const { addReview, getReviews, updateReview, deleteReview,getAllReviews,approveReview } = require("../controllers/reviewController");
const { protect,adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addReview); // Add Review (User Only)
router.get("/:eventId", getReviews); // Get All Reviews for an Event
router.get("/all", protect, adminOnly, getAllReviews);
router.put("/:id", protect, updateReview); // Update Review (User Only)
router.put("/:id/approve", protect, adminOnly, approveReview);

router.delete("/:id", protect, deleteReview); // Delete Review (User/Admin)
router.delete("/:id", protect, adminOnly, deleteReview);

module.exports = router;
