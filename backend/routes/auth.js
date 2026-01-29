const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const router = express.Router();

const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/users.json");

// In-memory storage for Vercel (FileSystem is Read-Only)
let users = [];

try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    users = JSON.parse(data);
  }
} catch (err) {
  console.error("Error loading initial users:", err);
}

router.post("/signup", async (req, res) => {
  const { email, password, role, name } = req.body;

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    email,
    password: hashed,
    role,
    name
  };

  users.push(newUser);
  // Note: Data is not persisted to file on Vercel

  res.json({ message: "Signup successful" });
});




router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // users is already loaded in memory

  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    "hackathon-secret",
    { expiresIn: "6h" }
  );

  // 🔥 SEND USER ALSO
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});


module.exports = router;
