require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

require("./src/config/db");

app.use(cors());
app.use(express.json());

app.use("/users", require("./src/routes/userRoutes"));
app.use("/transactions", require("./src/routes/transactionRoutes"));
app.use("/dashboard", require("./src/routes/dashboardRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});