/*** 
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Create
router.post("/", auth, role(["admin"]), (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  db.run(
    `INSERT INTO transactions (user_id, amount, type, category, date, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, amount, type, category, date, notes],
    function (err) {
      if (err) return res.status(400).json(err.message);
      res.json({ message: "Transaction added" });
    }
  );
});

// Get with filters
router.get("/", auth, (req, res) => {
  let query = "SELECT * FROM transactions WHERE 1=1";
  let params = [];

  if (req.query.type) {
    query += " AND type=?";
    params.push(req.query.type);
  }

  if (req.query.category) {
    query += " AND category=?";
    params.push(req.query.category);
  }

  db.all(query, params, (err, rows) => {
    res.json(rows);
  });
});

// Delete
router.delete("/:id", auth, role(["admin"]), (req, res) => {
  db.run(`DELETE FROM transactions WHERE id=?`, [req.params.id]);
  res.json({ message: "Deleted" });
});

module.exports = router; ***/

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  create,
  getAll,
  update,
  remove,
} = require("../controllers/transactionController");

router.post("/", auth, role("admin"), create);
router.get("/", auth, role("admin", "analyst"), getAll);
router.put("/:id", auth, role("admin"), update);
router.delete("/:id", auth, role("admin"), remove);

module.exports = router;