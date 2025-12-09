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

// Start server (CSV-based - no MongoDB required)
const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoint: GET /api/sales`);
      console.log(`📁 Using CSV data from src/data/sales.csv`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
