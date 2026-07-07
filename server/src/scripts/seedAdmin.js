import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

// Creates the first admin account from env vars, so admin creation can
// afterwards be restricted to existing admins.
//   SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
const run = async () => {
  const name = process.env.SEED_ADMIN_NAME || "Admin";
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (in server/.env) before seeding."
    );
    process.exit(1);
  }

  await connectDB(process.env.MONGO_URI);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`A user with email ${email} already exists — nothing to do.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  await User.create({ name, email, password, role: "admin" });
  console.log(`Admin created: ${email}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  console.error("Seeding failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
