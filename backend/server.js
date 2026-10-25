const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const { protect, adminOnly } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stats", protect, require("./routes/statsRoutes"));
app.use(
  "/api/students",
  protect,
  (req, res, next) => (req.method === "DELETE" ? adminOnly(req, res, next) : next()),
  require("./routes/StudentRoutes")
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port " + process.env.PORT);
    });
  })
  .catch((err) => console.log("Connection error:", err.message));