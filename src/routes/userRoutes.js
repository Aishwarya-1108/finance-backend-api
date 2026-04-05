/***const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role: userRole } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`,
    [name, email, hashed, userRole || "viewer", "active"],
    function (err) {
      if (err) return res.status(400).json(err.message);
      res.json({ message: "User created" });
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email=?`, [email], async (err, user) => {
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token });
  });
});

// Get users (Admin only)
router.get("/", auth, role(["admin"]), (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    res.json(rows);
  });
});

module.exports = router; ***/
const router = require("express").Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  register,
  login,
  getAllUsers,
  updateRole,
  updateStatus,
} = require("../controllers/userController");

// ✅ PUBLIC ROUTES
router.post("/register", register);
router.post("/login", login);

// ✅ ADMIN ROUTES (Protected)
router.get("/", auth, role("admin"), getAllUsers);

router.put("/:id/role", auth, role("admin"), updateRole);

router.put("/:id/status", auth, role("admin"), updateStatus);

module.exports = router;