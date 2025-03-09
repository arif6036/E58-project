require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
//const bodyparser=require("body-parser");


// Connect to database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
//app.use(bodyParser())

// Routes
const userRoutes = require("./src/routes/userRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
//const bodyParser = require("body-parser");

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


