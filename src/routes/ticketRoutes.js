const express = require("express");
const {
  processPayment,
  confirmBooking,
  cancelTicket,
  getUserTickets,
  getEventBookings,
  generateTicket,
  checkInTicket,
  createTicket,getAllTickets
} = require("../controllers/ticketController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Payment Route
router.post("/payment", protect, processPayment); // Process Payment Before Booking

// ✅ Ticket Booking System
router.post("/events/:eventId/tickets", protect, adminOnly, createTicket); // Admin Creates Ticket
router.post("/:eventId/book", protect, confirmBooking); // Confirm Booking After Payment
router.get("/all", protect, adminOnly, getAllTickets); // Get All Tickets (Admin Only)
router.get("/my-tickets", protect, getUserTickets); // Get User's Tickets
router.get("/:id/bookings", protect, adminOnly, getEventBookings); // Get All Bookings for an Event (Admin Only)
router.delete("/:id/cancel", protect, cancelTicket); // Cancel Ticket Booking
router.get("/ticket/:ticketId", protect, generateTicket); // Generate Ticket (With QR Code)
router.post("/ticket/:ticketId/check-in", protect, checkInTicket); // Check-in Ticket (Staff)

module.exports = router;
