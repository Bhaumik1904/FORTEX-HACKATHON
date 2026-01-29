const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const router = express.Router();

const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/users.json");

// In-memory storage for Vercel (FileSystem is Read-Only)
// Hardcoded users for Vercel Demo (Stateless environment)
// "admin123" hash: $2b$10$r.F6.p5/A.h.k.l.F.k.l.F.k.l.F.k.l.F.k.l.F.k.l.F.k.l.F (Example, need real hash)
// Actually we will use a known hash for "admin123"
// Hash for "password": $2b$10$3euPcmQFCiblsZeEu5s7p.9/.. (standard test hash)
// Let's generate a new hash or just accept plain text for demo? 
// No, keep bcrypt but use known hash.
// Default Admin Password: "admin" -> Hash: $2b$10$Pk/1.abc...
// Let's just create a new admin user in the list.

const defaultUsers = [
  {
    "id": 1,
    "email": "student@demo.com",
    "password": "$2b$10$PutYourKnownHashHereOrJustSignup",
    // We will trust the signup flow for students mostly, but let's put the existing from json if possible
    "role": "student",
    "name": "Demo Student"
  },
  {
    "id": 2,
    "email": "bhaumik_hinunia@srmap.edu.in",
    "password": "$2b$10$/VzaXzg8Az.g4/qeAaTL4ejE6RXc2xqY4EIqP/JSJpVi48CwbiIi2",
    "role": "student",
    "name": "Bhaumik"
  },
  {
    "id": 3,
    "email": "admin@srmap.edu.in",
    "password": "$2b$10$1DIICHu20St7krevZ11UgeHeIRgYHaVE/hcU073BaLL2Sbr8E7TJa", // Existing Hash
    "role": "admin",
    "name": "Admin"
  }
];

let users = [...defaultUsers];

// Try to load additional from file if exists, but keep defaults
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const fileUsers = JSON.parse(data);
    // Merge avoiding duplicates
    fileUsers.forEach(u => {
      if (!users.find(du => du.id === u.id)) users.push(u);
    });
  }
} catch (err) {
  console.log("Using default in-memory users");
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
