import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin123@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const admin = await User.create({
      email: "admin123@gmail.com",
      password: hashedPassword,
      role: "admin",
      skills: ["system-administration"]
    });

    console.log("Admin created successfully:", {
      email: admin.email,
      role: admin.role,
      id: admin._id
    });

    console.log("\n🔐 Admin Dashboard Access:");
    console.log("Email: admin123@gmail.com");
    console.log("Password: admin123");
    console.log("Only this admin can access the dashboard!");

  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected");
  }
};

// Admin dashboard middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  next();
};

// Dashboard redirect logic
export const dashboardRedirect = (user) => {
  if (user.role === "admin") {
    return "/admin/dashboard";
  }
  return "/user/dashboard";
};

createAdmin();