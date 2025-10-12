// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const { MONGO_URI } = require('./config'); // ✅ uses same DB connection string

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const username = 'Admin';
    const password = 'Admin@123';
    const displayName = 'Administrator';

    const existing = await User.findOne({ username });
    if (existing) {
      console.log("⚠️ Admin already exists!");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = new User({
      username,
      passwordHash,
      role: 'admin',
      displayName,
    });

    await admin.save();
    console.log(`✅ Admin user created successfully!`);
    console.log(`🔑 Username: ${username}`);
    console.log(`🔒 Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
})();
