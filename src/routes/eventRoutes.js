const express = require("express");
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Event (Protected)
router.post("/", protect, createEvent);

// Get All Events (Public)
router.get("/", getEvents);

// Get Single Event (Public)
router.get("/:id", getEventById);

// Update Event (Protected & Admin Only)
router.put("/:id", protect, adminOnly, updateEvent);

// Delete Event (Protected & Admin Only)
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
