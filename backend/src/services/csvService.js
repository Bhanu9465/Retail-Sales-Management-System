import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedData = null;

// Load CSV data into memory
const loadData = () => {
  return new Promise((resolve, reject) => {
    if (cachedData) {
      return resolve(cachedData);
    }
    
    const results = [];
    const csvPath = path.join(__dirname, "..", "data", "sales.csv");
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          customerId: row["Customer ID"],
          customerName: row["Customer Name"],
          phoneNumber: row["Phone Number"],
          gender: row["Gender"],
          age: parseInt(row["Age"]) || 0,
          customerRegion: row["Customer Region"],
          customerType: row["Customer Type"],
          productId: row["Product ID"],
          productName: row["Product Name"],
          brand: row["Brand"],
          productCategory: row["Product Category"],
          tags: row["Tags"] ? row["Tags"].split(",").map(t => t.trim()) : [],
          quantity: parseInt(row["Quantity"]) || 0,
          pricePerUnit: parseFloat(row["Price per Unit"]) || 0,
          discountPercentage: parseFloat(row["Discount Percentage"]) || 0,
          totalAmount: parseFloat(row["Total Amount"]) || 0,
          finalAmount: parseFloat(row["Final Amount"]) || 0,
          date: row["Date"],
          paymentMethod: row["Payment Method"],
          orderStatus: row["Order Status"],
          deliveryType: row["Delivery Type"],
          storeId: row["Store ID"],
          storeLocation: row["Store Location"],
          salespersonId: row["Salesperson ID"],
          employeeName: row["Employee Name"],
        });
      })
      .on("end", () => {
        cachedData = results;
        console.log(`✅ Loaded ${results.length} records from CSV`);
        resolve(results);
      })
      .on("error", reject);
  });
};

// Query data with filtering, sorting, pagination
export const querySalesFromCSV = async (params) => {
  const {
    search = "",
    filters = {},
    sortField = "date",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = params;

  let data = await loadData();

  // Search filter
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    data = data.filter(
      (row) =>
        (row.customerName && row.customerName.toLowerCase().includes(term)) ||
        (row.phoneNumber && row.phoneNumber.toLowerCase().includes(term))
    );
  }

  // Multi-select filters
  if (filters.region?.length) {
    data = data.filter((row) => filters.region.includes(row.customerRegion));
  }
  if (filters.gender?.length) {
    data = data.filter((row) => filters.gender.includes(row.gender));
  }
  if (filters.category?.length) {
    data = data.filter((row) => filters.category.includes(row.productCategory));
  }
  if (filters.paymentMethod?.length) {
    data = data.filter((row) => filters.paymentMethod.includes(row.paymentMethod));
  }

  // Age range
  if (typeof filters.ageMin === "number") {
    data = data.filter((row) => row.age >= filters.ageMin);
  }
  if (typeof filters.ageMax === "number") {
    data = data.filter((row) => row.age <= filters.ageMax);
  }

  // Date range
  if (filters.dateStart) {
    data = data.filter((row) => new Date(row.date) >= new Date(filters.dateStart));
  }
  if (filters.dateEnd) {
    data = data.filter((row) => new Date(row.date) <= new Date(filters.dateEnd));
  }

  const total = data.length;

  // Sorting
  data.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (sortField === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const start = (page - 1) * limit;
  const items = data.slice(start, start + limit);

  return { items, total };
};
