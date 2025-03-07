const Event = require("../models/eventModel");
require('dotenv').config()
// @desc    Create Event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    const { title, description, date, time, venue, ticketPrice, eventType } = req.body;

    try {
        const event = new Event({
            title,
            description,
            date,
            time,
            venue,
            ticketPrice,
            eventType,
            createdBy: req.user.id,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.message });
    }
};

// @desc    Get All Events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.message });
    }
};

// @desc    Get Event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.message });
    }
};

// @desc    Update Event
// @route   PUT /api/events/:id
// @access  Private (Admin Only)
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            event.title = req.body.title || event.title;
            event.description = req.body.description || event.description;
            event.date = req.body.date || event.date;
            event.time = req.body.time || event.time;
            event.venue = req.body.venue || event.venue;
            event.ticketPrice = req.body.ticketPrice || event.ticketPrice;
            event.eventType = req.body.eventType || event.eventType;

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.message });
    }
};

// @desc    Delete Event
// @route   DELETE /api/events/:id
// @access  Private (Admin Only)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.remove();
            res.json({ message: "Event removed" });
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error:error.message });
    }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
