const db = require("../config/db");
const jwt = require("jsonwebtoken");

// ✅ REGISTER USER
exports.register = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  db.run(
    "INSERT INTO users (email, password, role, status) VALUES (?, ?, ?, ?)",
    [email, password, role, "active"],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        message: "User created",
        userId: this.lastID,
      });
    }
  );
};

// ✅ LOGIN USER
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  db.get(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, user) => {
      if (err) return res.status(500).json(err);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // ✅ CHECK USER STATUS
      if (user.status !== "active") {
        return res.status(403).json({ message: "User inactive" });
      }

      // ✅ GENERATE TOKEN
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
      });
    }
  );
};

// ✅ GET ALL USERS (Admin only)
exports.getAllUsers = (req, res) => {
  db.all("SELECT id, email, role, status FROM users", [], (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(rows);
  });
};

// ✅ UPDATE USER ROLE
exports.updateRole = (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  db.run(
    "UPDATE users SET role=? WHERE id=?",
    [role, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      if (this.changes === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Role updated successfully" });
    }
  );
};

// ✅ UPDATE USER STATUS (active/inactive)
exports.updateStatus = (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  db.run(
    "UPDATE users SET status=? WHERE id=?",
    [status, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      if (this.changes === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Status updated successfully" });
    }
  );
};