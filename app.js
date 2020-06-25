require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const reminderRouter = require("./routes/reminderRoute");
const userRouter = require("./routes/userRoute");
const cors = require("cors");
const winston = require("winston");
const expressWinston = require("express-winston");
const app = express();

// middleware (run before every request hits the route)
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "utils/combined.js" }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    msg: `HTTP {{req.method}}`,
    expressFormat: true,
  })
);

// routes
app.use("/reminders", reminderRouter);
app.use("/users", userRouter);

// connect to MongoDB
const mongo = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_CREDENTIALS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");
  } catch (error) {
    console.log(error.message);
  }
};

const PORT = process.env.PORT || 9000;

// local server
app.listen(PORT, () => {
  mongo();
  console.log(`Listening on port ${PORT}...`);
});
