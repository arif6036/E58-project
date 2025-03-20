
require('dotenv').config()
const Event = require("../models/eventModel");
const cloudinary = require('cloudinary').v2;

// 1️⃣ Create Event (Protected)
const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, venue, eventType, ticketPrice } = req.body;

        if (!title || !date || !time || !venue || !eventType) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        let imageUrl = null;
        if (req.file) {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, { folder: "event-images" });
            imageUrl = uploadedImage.secure_url;
        }

        const event = new Event({
            title,
            description,
            date,
            time,
            venue,
            eventType,
            ticketPrice: eventType === "paid" ? ticketPrice : 0,
            image: imageUrl,
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
        const events = await Event.find().select("title description date time venue eventType ticketPrice image");;
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



module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents,
    getFilteredEvents,
};
