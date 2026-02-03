// backend/src/seed.ts
// Creates a single admin account for testing.
// Idempotent: safe to run multiple times — skips if the email already exists.
//
// Usage:
//   npx ts-node src/seed.ts
//
// Login credentials after running:
//   email:    admin@example.com
//   password: admin123

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { UserModel } from "./models/user.model";
import { MONGODB_URI } from "./config";

dotenv.config();

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_USERNAME = "admin";

async function seed() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected.\n");

  // Check if admin already exists
  const existing = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`⚠️  User with email "${ADMIN_EMAIL}" already exists.`);
    console.log(`   Role: ${existing.role}`);
    if (existing.role !== "admin") {
      console.log("   Upgrading role to admin...");
      existing.role = "admin";
      await existing.save();
      console.log("   ✅ Role updated to admin.");
    } else {
      console.log("   Already an admin — nothing to do.");
    }
    await mongoose.disconnect();
    return;
  }

  // Hash password the same way UserService does (cost factor 10)
  const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);

  const adminUser = new UserModel({
    email: ADMIN_EMAIL,
    password: hashedPassword,
    username: ADMIN_USERNAME,
    fullName: "Admin User",
    phoneNumber: "1234567890",
    gender: "other",
    role: "admin",
  });

  await adminUser.save();

  console.log("✅ Admin user created successfully.\n");
  console.log("  ┌─────────────────────────────────┐");
  console.log("  │  email:    admin@example.com     │");
  console.log("  │  password: admin123              │");
  console.log("  │  role:     admin                 │");
  console.log("  └─────────────────────────────────┘\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});