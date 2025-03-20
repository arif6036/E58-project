const Ticket = require("../models/ticketModel");
const Event = require("../models/eventModel");
const QRCode = require("qrcode");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Ensure Stripe Secret Key is in .env

// ✅ Create a new ticket (Admin Only)
const createTicket = async (req, res) => {
  try {
    const { ticketType, price } = req.body;
    const { eventId } = req.params;

    if (!ticketType || !price) {
      return res.status(400).json({ message: "Ticket type and price are required." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticket = new Ticket({
      event: event._id,
      user: req.user.id, // Assuming req.user contains logged-in user
      ticketType,
      price,
    });

    await ticket.save();
    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Process Payment (Using Stripe)
const processPayment = async (req, res) => {
  try {
    const { amount, userId, eventId } = req.body;

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      metadata: { userId, eventId },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment failed", error: error.message });
  }
};

// ✅ Confirm Booking After Payment Success
const confirmBooking = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { ticketType, price, quantity } = req.body;

    // ✅ Ensure user ID is included from the request (backend should get it from auth)
    const userId = req.user?.id; // Extract user ID from authMiddleware

    if (!userId) {
      return res.status(400).json({ message: "User authentication failed. Please login again." });
    }

    if (!ticketType || !price) {
      return res.status(400).json({ message: "Ticket type and price are required." });
    }

    const ticket = new Ticket({
      event: eventId,
      user: userId, // ✅ Attach the authenticated user ID
      ticketType,
      price,
      quantity: quantity || 1,
    });

    await ticket.save();
    res.status(201).json({ message: "Ticket booked successfully!", ticket });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get User's Tickets
const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).populate("event", "title date venue");

    if (!tickets.length) {
      return res.status(200).json([]); // ✅ Return empty array instead of 404 error
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Bookings for an Event (Admin)
const getEventBookings = async (req, res) => {
  try {
    const tickets = await Ticket.find({ event: req.params.id }).populate("user", "name email");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Cancel Ticket (User)
const cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found or already canceled" });
    }

    res.json({ message: "Ticket canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Generate Ticket (QR Code)
const generateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate("event", "name date venue");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify({ ticketId: ticket._id, event: ticket.event.name }));

    ticket.qrCode = qrCodeUrl;
    await ticket.save();

    res.json({ qrCode: qrCodeUrl, ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Check-in Ticket (Event Staff)
const checkInTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.isCheckedIn) {
      return res.status(400).json({ message: "Ticket already checked in" });
    }

    ticket.isCheckedIn = true;
    ticket.checkInTime = new Date();
    await ticket.save();

    res.json({ message: "Check-in successful", ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Get All Tickets (Admin Only)
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("event", "title date venue");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Export Controllers
module.exports = {
  processPayment,
  confirmBooking,
  getAllTickets,
  cancelTicket,
  getUserTickets,
  getEventBookings,
  generateTicket,
  checkInTicket,
  createTicket,
};
