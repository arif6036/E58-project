
require('dotenv').config()
const Event = require("../models/eventModel");
const Ticket = require("../models/ticketModel");
const QRCode = require("qrcode");

// 1️⃣ Create Event (Protected)
const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, venue, eventType, ticketPrice } = req.body;

        // Validate required fields
        if (!title || !date || !time || !venue || !eventType) {
            return res.status(400).json({ message: "Please provide all required fields: title, date, time, venue, eventType" });
        }

        // If event is paid, ticketPrice must be provided
        if (eventType === "paid" && (ticketPrice === undefined || ticketPrice < 0)) {
            return res.status(400).json({ message: "Ticket price is required for paid events and must be positive" });
        }

        const event = new Event({
            title,
            description,
            date,
            time,
            venue,
            eventType,
            ticketPrice: eventType === "paid" ? ticketPrice : 0, // Default to 0 for free events
            createdBy: req.user.id,
        });

        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 2️⃣ Get All Events (Public)
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// 3️⃣ Get Single Event (Public)
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 4️⃣ Update Event (Admin Only)
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        Object.assign(event, req.body);
        await event.save();

        res.json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 5️⃣ Delete Event (Admin Only)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.deleteOne();
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 6️⃣ Get Events Created by Organizer
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user.id });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 7️⃣ Filter Events (By Date, Category, etc.)
const getFilteredEvents = async (req, res) => {
    try {
        const { category, date } = req.query;
        const query = {};

        if (category) query.category = category;
        if (date) query.date = { $gte: new Date(date) };

        const events = await Event.find(query);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 8️⃣ Book Ticket (User)
const bookTicket = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const { ticketType, price } = req.body;

        const ticket = await Ticket.create({
            event: event._id,
            user: req.user.id,
            ticketType,
            price,
        });

        res.status(201).json({ message: "Ticket booked successfully", ticket });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 9️⃣ Get User's Tickets
const getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).populate("event", "name date venue");
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 🔟 Get All Bookings for an Event (Admin)
const getEventBookings = async (req, res) => {
    try {
        const tickets = await Ticket.find({ event: req.params.id }).populate("user", "name email");
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 1️⃣1️⃣ Cancel Ticket (User)
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

// 1️⃣2️⃣ Generate Ticket (QR Code)
const generateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId).populate("event", "name date venue");

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Generate QR Code
        const qrCodeUrl = await QRCode.toDataURL(JSON.stringify({ ticketId: ticket._id, event: ticket.event.name }));

        ticket.qrCode = qrCodeUrl;
        await ticket.save();

        res.json({ qrCode: qrCodeUrl, ticket });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 1️⃣3️⃣ Check-in Ticket (Event Staff)
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

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents,
    getFilteredEvents,
    bookTicket,
    getUserTickets,
    getEventBookings,
    cancelTicket,
    generateTicket,
    checkInTicket
};
