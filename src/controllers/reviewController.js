const Review = require("../models/reviewModel");
const Event = require("../models/eventModel");

// ✅ 1️⃣ Add a Review
const addReview = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    if (!eventId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingReview = await Review.findOne({ event: eventId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this event" });
    }

    const review = await Review.create({
      event: eventId,
      user: req.user.id,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 2️⃣ Get All Reviews for an Event
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId }).populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 3️⃣ Update Review (Only User who posted it)
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this review" });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ 4️⃣ Delete Review (User/Admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Get All Reviews (Admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name").populate("event", "title");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Approve a Review
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.approved = true;
    await review.save();
    res.json({ message: "Review approved successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { addReview, getReviews, updateReview, deleteReview, getAllReviews, approveReview };
