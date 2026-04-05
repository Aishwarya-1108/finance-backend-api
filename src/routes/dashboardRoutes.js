/***const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// Summary
router.get("/summary", auth, (req, res) => {
  db.get(
    `SELECT 
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
     FROM transactions`,
    [],
    (err, row) => {
      res.json({
        income: row.income || 0,
        expense: row.expense || 0,
        balance: (row.income || 0) - (row.expense || 0),
      });
    }
  );
});

// Category wise
router.get("/category", auth, (req, res) => {
  db.all(
    `SELECT category, SUM(amount) as total 
     FROM transactions GROUP BY category`,
    [],
    (err, rows) => {
      res.json(rows);
    }
  );
});

module.exports = router; ***/

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  summary,
  category,
  recent,
  monthly,
} = require("../controllers/dashboardController");

router.get("/summary", auth, role("admin", "analyst", "viewer"), summary);
router.get("/category", auth, role("admin", "analyst"), category);
router.get("/recent", auth, role("admin", "analyst", "viewer"), recent);
router.get("/monthly", auth, role("admin", "analyst"), monthly);

module.exports = router;