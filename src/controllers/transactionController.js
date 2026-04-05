const db = require("../config/db");

// ✅ CREATE TRANSACTION
exports.create = (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  

  if (!amount || !type || !category || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.run(
    `INSERT INTO transactions (user_id, amount, type, category, date, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, amount, type, category, date, notes || ""],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Transaction created",
        transactionId: this.lastID,
      });
    }
  );
};

// ✅ GET ALL TRANSACTIONS + FILTER + PAGINATION
exports.getAll = (req, res) => {
  let query = "SELECT * FROM transactions WHERE user_id=?";
  let params = [req.user.id];

  // 🔍 FILTERS
  if (req.query.category) {
    query += " AND category=?";
    params.push(req.query.category);
  }

  if (req.query.type) {
    query += " AND type=?";
    params.push(req.query.type);
  }

  if (req.query.date) {
    query += " AND date=?";
    params.push(req.query.date);
  }

  // ⭐ PAGINATION
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  query += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json({
      page,
      limit,
      data: rows,
    });
  });
};

// ✅ UPDATE TRANSACTION (ALL FIELDS)
exports.update = (req, res) => {
  const { id } = req.params;
  const { amount, type, category, date, notes } = req.body;

  db.run(
    `UPDATE transactions 
     SET amount=?, type=?, category=?, date=?, notes=? 
     WHERE id=? AND user_id=?`,
    [amount, type, category, date, notes, id, req.user.id],
    function (err) {
      if (err) return res.status(500).json(err);

      if (this.changes === 0) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json({ message: "Transaction updated successfully" });
    }
  );
};

// ✅ DELETE TRANSACTION
exports.remove = (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM transactions WHERE id=? AND user_id=?",
    [id, req.user.id],
    function (err) {
      if (err) return res.status(500).json(err);

      if (this.changes === 0) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json({ message: "Transaction deleted successfully" });
    }
  );
};