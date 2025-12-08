import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  customerId: String,
  customerName: String,
  phoneNumber: String,
  gender: String,
  age: Number,
  customerRegion: String,
  customerType: String,

  productId: String,
  productName: String,
  brand: String,
  productCategory: String,
  tags: [String],

  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,

  date: Date,
  paymentMethod: String,
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salespersonId: String,
  employeeName: String
}, { timestamps: true });

// Create indexes for common query patterns
SaleSchema.index({ customerName: "text", phoneNumber: "text" });
SaleSchema.index({ customerRegion: 1 });
SaleSchema.index({ gender: 1 });
SaleSchema.index({ productCategory: 1 });
SaleSchema.index({ paymentMethod: 1 });
SaleSchema.index({ date: -1 });
SaleSchema.index({ age: 1 });

export default mongoose.model("Sale", SaleSchema);
