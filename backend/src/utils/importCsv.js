import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Sale from "../models/Sale.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = process.env.DATA_FILE 
  ? path.resolve(process.env.DATA_FILE)
  : path.join(__dirname, "..", "data", "sales.csv");

const BATCH_SIZE = 5000; // Batch size for bulk insert

// Helper functions
const safe = (v) => (v === undefined || v === null ? "" : String(v).trim());

const parseNum = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const parseDate = (v) => {
  if (!v) return null;
  const str = safe(v);
  
  // Try ISO format (YYYY-MM-DD)
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return new Date(str.split("T")[0]);
  }
  
  // Try DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  }
  
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Normalize CSV row to match schema
const normalize = (row) => ({
  customerId: safe(row["Customer ID"] ?? row.customerId),
  customerName: safe(row["Customer Name"] ?? row.customerName),
  phoneNumber: safe(row["Phone Number"] ?? row.phoneNumber),
  gender: safe(row["Gender"] ?? row.gender),
  age: parseNum(row["Age"] ?? row.age),
  customerRegion: safe(row["Customer Region"] ?? row.customerRegion),
  customerType: safe(row["Customer Type"] ?? row.customerType),

  productId: safe(row["Product ID"] ?? row.productId),
  productName: safe(row["Product Name"] ?? row.productName),
  brand: safe(row["Brand"] ?? row.brand),
  productCategory: safe(row["Product Category"] ?? row.productCategory),
  tags: (safe(row["Tags"] ?? row.tags) || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean),

  quantity: parseNum(row["Quantity"] ?? row.quantity) || 0,
  pricePerUnit: parseNum(row["Price per Unit"] ?? row.pricePerUnit) || 0,
  discountPercentage: parseNum(row["Discount Percentage"] ?? row.discountPercentage) || 0,
  totalAmount: parseNum(row["Total Amount"] ?? row.totalAmount) || 0,
  finalAmount: parseNum(row["Final Amount"] ?? row.finalAmount) || 0,

  date: parseDate(row["Date"] ?? row.date),
  paymentMethod: safe(row["Payment Method"] ?? row.paymentMethod),
  orderStatus: safe(row["Order Status"] ?? row.orderStatus),
  deliveryType: safe(row["Delivery Type"] ?? row.deliveryType),
  storeId: safe(row["Store ID"] ?? row.storeId),
  storeLocation: safe(row["Store Location"] ?? row.storeLocation),
  salespersonId: safe(row["Salesperson ID"] ?? row.salespersonId),
  employeeName: safe(row["Employee Name"] ?? row.employeeName),
});

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGO_URI not set in .env");
      process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(mongoUri, { dbName: process.env.DB_NAME || "truestate" });
    console.log("✅ Connected to MongoDB");

    if (!fs.existsSync(CSV_PATH)) {
      console.error(`❌ CSV not found at ${CSV_PATH}`);
      console.error("   Set DATA_FILE in .env or place file at backend/src/data/sales.csv");
      process.exit(1);
    }

    // Clear existing data (optional - comment out if you want to append)
    console.log("🗑️  Clearing existing data...");
    await Sale.deleteMany({});

    console.log(`📂 Importing CSV from: ${CSV_PATH}`);
    const startTime = Date.now();

    const stream = fs.createReadStream(CSV_PATH).pipe(csv());
    let buffer = [];
    let inserted = 0;
    let processed = 0;

    for await (const row of stream) {
      processed++;
      const normalized = normalize(row);
      
      // Skip rows without required data
      if (!normalized.date) continue;
      
      buffer.push(normalized);

      if (buffer.length >= BATCH_SIZE) {
        await Sale.insertMany(buffer, { ordered: false }).catch((e) => {
          console.warn("⚠️  Insert batch warning:", e.message);
        });
        inserted += buffer.length;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`⏳ Inserted ${inserted.toLocaleString()} records (${elapsed}s)...`);
        buffer = [];
      }
    }

    // Insert remaining records
    if (buffer.length) {
      await Sale.insertMany(buffer, { ordered: false }).catch((e) => {
        console.warn("⚠️  Insert final batch warning:", e.message);
      });
      inserted += buffer.length;
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Import completed!`);
    console.log(`   📊 Total processed: ${processed.toLocaleString()}`);
    console.log(`   ✅ Total inserted: ${inserted.toLocaleString()}`);
    console.log(`   ⏱️  Time taken: ${elapsed}s`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Import error:", err.stack || err);
    process.exit(1);
  }
};

run();
