const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const { protect, adminOnly } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));

// Vercel serverless: make sure DB is connected before every request
let dbPromise = null;
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!dbPromise) {
    dbPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => {
        dbPromise = null;
        console.log("Connection error:", err.message);
        throw err;
      });
  }
  return dbPromise;
}

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stats", protect, require("./routes/statsRoutes"));
app.use(
  "/api/students",
  protect,
  (req, res, next) => (req.method === "DELETE" ? adminOnly(req, res, next) : next()),
  require("./routes/StudentRoutes")
);

if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log("Server running on port " + PORT));
  });
}