import Sale from "../models/Sale.js";

/**
 * Query sales with search, filters, sorting, and pagination
 * All logic is done via MongoDB queries for efficiency
 */
export const querySales = async (params) => {
  const {
    search = "",
    filters = {},
    sortField = "date",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = params;

  // Build MongoDB filter object
  const mongoFilter = {};

  // Search: case-insensitive substring match on customerName or phoneNumber
  if (search && String(search).trim()) {
    const term = String(search).trim();
    mongoFilter.$or = [
      { customerName: { $regex: term, $options: "i" } },
      { phoneNumber: { $regex: term, $options: "i" } },
    ];
  }

  // Multi-select filters (using $in for arrays)
  if (filters.region?.length) {
    mongoFilter.customerRegion = { $in: filters.region };
  }
  if (filters.gender?.length) {
    mongoFilter.gender = { $in: filters.gender };
  }
  if (filters.category?.length) {
    mongoFilter.productCategory = { $in: filters.category };
  }
  if (filters.tags?.length) {
    mongoFilter.tags = { $in: filters.tags };
  }
  if (filters.paymentMethod?.length) {
    mongoFilter.paymentMethod = { $in: filters.paymentMethod };
  }

  // Age range filter
  if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
    mongoFilter.age = {};
    if (typeof filters.ageMin === "number") {
      mongoFilter.age.$gte = filters.ageMin;
    }
    if (typeof filters.ageMax === "number") {
      mongoFilter.age.$lte = filters.ageMax;
    }
    // Remove empty age filter
    if (Object.keys(mongoFilter.age).length === 0) {
      delete mongoFilter.age;
    }
  }

  // Date range filter
  if (filters.dateStart || filters.dateEnd) {
    mongoFilter.date = {};
    if (filters.dateStart) {
      mongoFilter.date.$gte = new Date(filters.dateStart);
    }
    if (filters.dateEnd) {
      mongoFilter.date.$lte = new Date(filters.dateEnd);
    }
  }

  // Get total count for pagination
  const total = await Sale.countDocuments(mongoFilter);

  // Build sort object
  const sortObj = {};
  const validSortFields = ["date", "quantity", "customerName", "totalAmount", "finalAmount"];
  const field = validSortFields.includes(sortField) ? sortField : "date";
  sortObj[field] = sortOrder === "asc" ? 1 : -1;

  // Calculate skip for pagination
  const skip = (Math.max(1, page) - 1) * Math.max(1, limit);

  // Execute query
  const items = await Sale.find(mongoFilter)
    .sort(sortObj)
    .skip(skip)
    .limit(Math.max(1, limit))
    .lean()
    .exec();

  return { items, total };
};
