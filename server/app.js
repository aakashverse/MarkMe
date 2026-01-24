require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRoutes = require("./routers/studentRoutes");
const facultyRoutes = require("./routers/facultyRoutes");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// db connect
mongoose
  .connect(process.env.ATLAS_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error(err));

// routes
app.use("/student", studentRoutes);
app.use("/faculty", facultyRoutes);

app.get("/", (req, res) => {
  res.send("Server running ");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});
