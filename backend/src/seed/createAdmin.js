import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

async function createAdmin() {
  try {
    await connectDB();

    const email = "admin@cyberraksha.com";
    const password = "Admin@123"; // 👈 Admin password
    const name = "CyberRaksha Admin";

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      console.log("⚠️ Admin already exists:", exists.email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "ADMIN",
      isActive: true
    });

    console.log("✅ Admin created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", password);
    console.log("👑 Role:", admin.role);

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
