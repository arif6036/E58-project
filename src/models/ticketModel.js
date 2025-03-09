const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event", // Reference to the Event model
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        ticketType: {
            type: String,
            enum: ["VIP", "General", "Standard"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        qrCode: {
            type: String, // URL or encoded QR code string
        },
        isCheckedIn: {
            type: Boolean,
            default: false,
        },
        checkInTime: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
