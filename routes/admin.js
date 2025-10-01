const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Group = require("../models/Group");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

/* -------- User Management -------- */
// 📋 Get all users
router.get("/users", auth, isAdmin, async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
});

// ➕ Create a new user
router.post("/users", auth, isAdmin, async (req, res) => {
  try {
    const { username, password, displayName, role } = req.body;

    // check if exists
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      passwordHash,
      displayName,
      role: role || "user",
    });

    await newUser.save();

    res.json({
      ok: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✏️ Update user
router.put("/users/:id", auth, isAdmin, async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-passwordHash");
  res.json(user);
});

// ❌ Delete user
router.delete("/users/:id", auth, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* -------- Group Management -------- */
router.get("/groups", auth, isAdmin, async (req, res) => {
  const groups = await Group.find().populate("members", "username displayName role");
  res.json(groups);
});

router.post("/groups", auth, isAdmin, async (req, res) => {
  const { name, members } = req.body;
  const group = new Group({ name, members });
  await group.save();
  res.json(group);
});

router.put("/groups/:id", auth, isAdmin, async (req, res) => {
  const { name, members } = req.body;
  const group = await Group.findByIdAndUpdate(req.params.id, { name, members }, { new: true })
    .populate("members", "username displayName role");
  res.json(group);
});

router.delete("/groups/:id", auth, isAdmin, async (req, res) => {
  await Group.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
