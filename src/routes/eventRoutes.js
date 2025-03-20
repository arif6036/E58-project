const express = require("express");
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents,getFilteredEvents
} = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); 

const router = express.Router();

// 1️⃣ Create Event (Protected)
router.post('/', protect, adminOnly, upload.single('image'), createEvent);

// 2️⃣ Get All Events (Public)
router.get('/', getEvents);

// 3️⃣ Get Single Event (Public)
router.get('/:id', getEventById);

// 4️⃣ Update Event (Admin Only)
router.put('/:id', protect, adminOnly, updateEvent);

// 5️⃣ Delete Event (Admin Only)
router.delete('/:id', protect, adminOnly, deleteEvent);

// 6️⃣ Get Events Created by Organizer (Protected)
router.get('/my-events', protect, getMyEvents);

// 7️⃣ Filter Events (By Date, Category, etc.)
router.get('/filter', getFilteredEvents);
// ✅ Ensure only admins can create events


module.exports = router;
