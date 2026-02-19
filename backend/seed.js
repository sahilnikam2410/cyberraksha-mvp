import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./src/config/db.js";
import User from "./src/models/User.js";

dotenv.config();
await connectDB();

async function run() {
  const email = "admin@cyberraksha.com";
  const password = "Admin@123";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("✅ Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    name: "CyberRaksha Admin",
    email,
    passwordHash,
    role: "ADMIN"
  });

  console.log("✅ Seeded Admin:");
  console.log("Email:", email);
  console.log("Password:", password);
  process.exit(0);
}

run();
