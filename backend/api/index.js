const express = require("express");
const cors = require("cors");

const authRoutes = require("../routes/auth");
const complaintRoutes = require("../routes/complaints");

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow any origin for now to ensure it works locally and on Vercel
    // In production, you might want to restrict this to specific domains
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);

module.exports = app;
