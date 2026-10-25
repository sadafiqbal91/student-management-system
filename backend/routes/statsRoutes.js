const express = require("express");
const Student = require("../models/student");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = await Student.countDocuments({ createdAt: { $gte: weekAgo } });
    const users = await User.countDocuments();
    const recent = await Student.find().sort({ createdAt: -1 }).limit(5);
    res.json({ total, thisWeek, users, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;