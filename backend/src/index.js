import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import salesRoutes from "./routes/salesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Retail Sales API - TruEstate Assignment" });
});

// Single API endpoint
app.use("/api/sales", salesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err);
  res.status(500).json({ message: "Internal server error" });
});

// Uncaught exception handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack || err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason?.stack || reason);
});

// Start server with MongoDB connection
const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGO_URI not set in environment. Create .env file from .env.example");
      process.exit(1);
    }

    await mongoose.connect(mongoUri, { dbName: process.env.DB_NAME || "truestate" });
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoint: GET /api/sales`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
