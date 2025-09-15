import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Ticket from "../models/ticket.js";
import { inngest } from "../inngest/client.js";


export const signup = async (req, res) => {
  const { email, password, skills = [],role } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ email, password: hashed, skills ,role:role});

    // Fire Inngest event
    await inngest.send({
      name: "user/signup", // 👈 make sure this matches your Inngest function
      data: { email },
    });

    // Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send safe user (exclude password)
    const { password: _, ...safeUser } = user.toObject();

    res.status(201).json({ user: safeUser, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    // Dashboard redirect based on role
    const redirectUrl = user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

    res.json({ user, token, redirectUrl });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorzed" });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Unauthorized" });
    });
    res.json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ eeor: "Forbidden" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    await User.updateOne(
      { email },
      { skills: skills.length ? skills : user.skills, role }
    );
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Update failed", details: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const [users, tickets] = await Promise.all([
      User.find().select("-password"),
      Ticket.find().populate("assignedTo", "email").populate("createdBy", "email")
    ]);

    const stats = {
      totalUsers: users.filter(u => u.role === "user").length,
      totalModerators: users.filter(u => u.role === "moderator").length,
      totalAdmins: users.filter(u => u.role === "admin").length,
      totalTickets: tickets.length,
      assignedTickets: tickets.filter(t => t.assignedTo).length,
      unassignedTickets: tickets.filter(t => !t.assignedTo).length,
      moderators: users.filter(u => u.role === "moderator").map(m => ({
        email: m.email,
        skills: m.skills,
        assignedTickets: tickets.filter(t => t.assignedTo?._id.toString() === m._id.toString())
      })),
      recentTickets: tickets.slice(-10).reverse()
    };

    return res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats", details: error.message });
  }
};
