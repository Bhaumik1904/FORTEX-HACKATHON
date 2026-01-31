const express = require("express");
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/auth");
const { sendStatusUpdateEmail } = require("../services/notification");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "../data/complaints.json");

// In-memory storage for Vercel
// Hardcoded complaints for Vercel Demo
const defaultComplaints = [
  {
    "id": 1,
    "category": "Hostel - Maintenance",
    "description": "ROOM DOOR LOCK BROKEN",
    "status": "Submitted",
    "user_id": 1,
    "timestamp": new Date().toISOString(),
    "deadline": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    "assignedTo": ""
  },
  {
    "id": 2,
    "category": "Hostel - Food Quality",
    "description": "FOOD QUALITY IS VERY BAD (Sample)",
    "status": "Assigned",
    "user_id": 2,
    "timestamp": new Date().toISOString(),
    "deadline": new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    "assignedTo": "Hostel Administration"
  }
];

// Load Default Users to lookup emails (Mock logic for Vercel)
// In a real app, you would query the database
const defaultUsers = [
  { id: 1, email: "student@demo.com", name: "Demo Student" },
  { id: 2, email: "bhaumik_hinunia@srmap.edu.in", name: "Bhaumik" },
  { id: 3, email: "admin@srmap.edu.in", name: "Admin" }
];

let complaints = [...defaultComplaints];

try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const fileComplaints = JSON.parse(data);
    fileComplaints.forEach(c => {
      if (!complaints.find(dc => dc.id === c.id)) complaints.push(c);
    });
  }
} catch (err) {
  console.error(`Using default in-memory complaints`);
}

router.get("/me", auth, (req, res) => {
  try {
    // complaints is in-memory now

    // Safety Check: Ensure req.user exists
    if (!req.user || !req.user.userId) {
      console.error("[GET /me] Missing User ID in request. Auth middleware might be failing.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Debugging: Check who the server thinks is logged in
    console.log(`[GET /me] Request from User ID: ${req.user.userId}`);

    const myComplaints = complaints.filter(
      c => {
        const ownerId = c.user_id || c.userId || c.studentId;
        return String(ownerId) === String(req.user.userId);
      }
    );

    console.log(`[GET /me] Found ${myComplaints.length} complaints for this user.`);

    res.json(myComplaints);
  } catch (error) {
    console.error("Error in GET /me:", error);
    res.status(500).json({ message: "Server error fetching complaints" });
  }
});

router.get("/", auth, (req, res) => {
  // complaints is in-memory now

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { role, department } = req.user;

  // Super Admin: View All
  if (role === 'super_admin' || role === 'admin') {
    return res.json(complaints);
  }

  // Department Admin: View only relevant complaints
  if (role === 'dept_admin') {
    if (!department) return res.json([]); // Safety check

    const filtered = complaints.filter(c =>
      (c.category && c.category.includes(department)) ||
      (c.assignedTo === department)
    );
    return res.json(filtered);
  }

  // Students or others should not access this full list
  return res.status(403).json({ message: "Access denied" });
});

router.post("/", auth, (req, res) => {
  // complaints is in-memory now

  // Safety Check: Ensure req.user exists to prevent server crash
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fix: Check multiple possible field names for deadline/date to catch what frontend sends
  let deadlineIso = req.body.deadline || req.body.date || req.body.customDate || req.body.dueDate;

  if (!deadlineIso || deadlineIso === "") {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7); // 7 days from now
    deadlineIso = deadline.toISOString();
  }

  // Fix: Better ID generation to avoid duplicates (use max ID instead of length)
  const maxId = complaints.reduce((max, c) => (c.id > max ? c.id : max), 0);

  const newComplaint = {
    id: maxId + 1,
    category: req.body.category || req.body.department || "General", // ✅ match frontend (with fallback)
    description: req.body.description,
    status: "Submitted",
    user_id: req.user.userId,
    timestamp: new Date().toISOString(),
    deadline: deadlineIso,
    assignedTo: req.body.assignedTo || req.body.assignee || "", // ✅ Capture assignedTo if provided
    aiAnalysis: req.body.aiAnalysis, // ✅ keep AI data
    timeline: [
      { status: "Submitted", timestamp: new Date().toISOString() }
    ]
  };

  complaints.push(newComplaint);
  // fs.writeFileSync(DATA_FILE, JSON.stringify(complaints, null, 2));

  res.json({ message: "Complaint created successfully", complaint: newComplaint });
});

router.get("/:id", auth, (req, res) => {
  // complaints is in-memory now
  const complaint = complaints.find(c => c.id === parseInt(req.params.id));

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.json(complaint);
});

router.put("/:id", auth, (req, res) => {
  // complaints is in-memory now
  const complaintIndex = complaints.findIndex(c => c.id === parseInt(req.params.id));

  if (complaintIndex === -1) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const updates = { ...req.body };

  // Fix: Prevent ID corruption (ensure ID is not overwritten by frontend data)
  delete updates.id;

  // Fix: Map aliases to ensure updates persist correctly
  if (!updates.deadline) {
    if (updates.date) updates.deadline = updates.date;
    if (updates.customDate) updates.deadline = updates.customDate;
  }

  // Fix: Map 'department' to 'category' (consistent with POST)
  if (updates.department && !updates.category) {
    updates.category = updates.department;
  }

  if (updates.status && updates.status !== complaints[complaintIndex].status) {
    if (!complaints[complaintIndex].timeline) {
      complaints[complaintIndex].timeline = [];
    }
    complaints[complaintIndex].timeline.push({
      status: updates.status,
      timestamp: new Date().toISOString()
    });

    // 📧 Notification Logic
    // Find the user to get their email
    const userId = complaints[complaintIndex].user_id || complaints[complaintIndex].userId;
    const user = defaultUsers.find(u => u.id === parseInt(userId)); // Mock lookup

    // Also try to find in file-based users if available (optional)

    if (user && user.email) {
      console.log(`[Notification] Sending email to ${user.email} for status ${updates.status}`);
      sendStatusUpdateEmail(
        user.email,
        user.name || "Student",
        complaints[complaintIndex].category,
        updates.status
      ).catch(err => console.error("Notification Failed:", err));
    } else {
      console.log(`[Notification] User not found for ID ${userId}, skipping email.`);
    }
  }

  complaints[complaintIndex] = {
    ...complaints[complaintIndex],
    ...updates
  };

  // fs.writeFileSync(DATA_FILE, JSON.stringify(complaints, null, 2));

  res.json(complaints[complaintIndex]);
});

router.delete("/:id", auth, (req, res) => {
  // complaints is in-memory now
  const newComplaints = complaints.filter(c => c.id !== parseInt(req.params.id));

  if (complaints.length === newComplaints.length) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  // fs.writeFileSync(DATA_FILE, JSON.stringify(newComplaints, null, 2));
  complaints = newComplaints; // update in-memory reference

  res.json({ message: "Complaint deleted successfully" });
});


module.exports = router;
