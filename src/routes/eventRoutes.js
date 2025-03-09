const express = require("express");
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getFilteredEvents,
    getMyEvents,
    bookTicket,
    getUserTickets,
    getEventBookings,
    cancelTicket,
    generateTicket,
    checkInTicket
} = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Event CRUD Routes
router.post("/", protect, createEvent); // Create Event (Protected)
router.get("/", getEvents); // Get All Events (Public)
router.get("/:id", getEventById); // Get Single Event (Public)
router.put("/:id", protect, adminOnly, updateEvent); // Update Event (Admin Only)
router.delete("/:id", protect, adminOnly, deleteEvent); // Delete Event (Admin Only)

// Event Filtering & Organizers' Events
router.get("/filter", getFilteredEvents); // Filter Events
router.get("/my-events", protect, getMyEvents); // Get Events Created by Organizer

// Ticket Booking System
router.post("/:id/book", protect, bookTicket); // Book Ticket
router.get("/my-tickets", protect, getUserTickets); // Get User's Tickets
router.get("/:id/bookings", protect, adminOnly, getEventBookings); // Get All Bookings for an Event (Admin Only)
router.delete("/:id/cancel", protect, cancelTicket); // Cancel Ticket Booking
router.get("/ticket/:ticketId", protect, generateTicket); // Generate Ticket (With QR Code)
router.post("/ticket/:ticketId/check-in", protect, checkInTicket); // Check-in Ticket (Staff)





module.exports = router;
