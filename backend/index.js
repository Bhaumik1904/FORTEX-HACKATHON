const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);

module.exports = app;
