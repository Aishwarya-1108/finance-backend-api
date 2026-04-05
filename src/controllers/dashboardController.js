const db = require("../config/db");

// ✅ SUMMARY API
exports.summary = (req, res) => {
  db.all(
    `SELECT 
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
     FROM transactions
     WHERE user_id=?`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      const income = rows[0].income || 0;
      const expense = rows[0].expense || 0;

      res.json({
        income,
        expense,
        balance: income - expense,
      });
    }
  );
};

// ✅ CATEGORY-WISE TOTAL
exports.category = (req, res) => {
  db.all(
    `SELECT category, SUM(amount) as total
     FROM transactions
     WHERE user_id=?
     GROUP BY category`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};

// ✅ RECENT TRANSACTIONS
exports.recent = (req, res) => {
  db.all(
    `SELECT * FROM transactions
     WHERE user_id=?
     ORDER BY date DESC
     LIMIT 5`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};

// ✅ MONTHLY TRENDS
exports.monthly = (req, res) => {
  db.all(
    `SELECT 
      strftime('%Y-%m', date) as month,
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
     FROM transactions
     WHERE user_id=?
     GROUP BY month
     ORDER BY month`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};