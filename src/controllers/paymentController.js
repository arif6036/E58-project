const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Ticket = require("../models/ticketModel");
const Event = require("../models/eventModel");

// ✅ Initiate Stripe Payment
const initiatePayment = async (req, res) => {
  try {
    const { eventId, amount, userId, quantity } = req.body;

    if (!eventId || !amount || !userId || !quantity) {
      return res.status(400).json({ message: "Missing required payment details." });
    }

    // ✅ Verify Event Exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // ✅ Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe requires amount in cents
      currency: "usd",
      metadata: { userId, eventId, quantity },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).json({ message: "Payment initiation failed.", error: error.message });
  }
};

// ✅ Confirm Booking After Payment Success
const confirmBooking = async (req, res) => {
  try {
    const { eventId, ticketType, price, quantity } = req.body;
    const userId = req.user.id;

    if (!eventId || !ticketType || !price || !quantity) {
      return res.status(400).json({ message: "Missing booking details." });
    }

    // ✅ Verify Event Exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // ✅ Create Ticket in Database
    const ticket = await Ticket.create({
      event: event._id,
      user: userId,
      ticketType,
      price,
      quantity,
    });

    res.status(201).json({ message: "Ticket booked successfully", ticket });

  } catch (error) {
    console.error("Booking Confirmation Error:", error);
    res.status(500).json({ message: "Failed to confirm booking.", error: error.message });
  }
};

module.exports = { initiatePayment, confirmBooking };
