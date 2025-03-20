const mongoose = require("mongoose");
const eventSchema = mongoose.Schema(
    {
        title: { type: String, required: true, },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        venue: {
            type: String,
            required: true,
        },
        ticketPrice: {
            type: Number,
            required: true,
        },
        eventType: { type: String, enum: ["free", "paid"], required: true },
        ticketPrice: {
            type: Number, required: function () { return this.eventType === "paid"; }
        },


        ticketPrice: {
            type: Number,
            required: function () { return this.eventType === "paid"; }
        }, // ✅ Ticket price required for paid events
        isActive: {
            type: Boolean,
            default: true,
        },
        image: { type: String },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("Event", eventSchema);
