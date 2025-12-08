import { querySales } from "../services/salesService.js";

/**
 * GET /api/sales
 * Supports: search, filters (multi-select), sorting, pagination
 */
export const getSales = async (req, res) => {
  try {
    const {
      search = "",
      page = "1",
      limit = "10",
      sortField = "date",
      sortOrder = "desc",
      // Multi-select filters (comma-separated)
      region,
      gender,
      category,
      tags,
      paymentMethod,
      // Range filters
      ageMin,
      ageMax,
      dateStart,
      dateEnd,
    } = req.query;

    // Parse comma-separated filter values into arrays
    const parseList = (val) =>
      val
        ? String(val)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const filters = {
      region: parseList(region),
      gender: parseList(gender),
      category: parseList(category),
      tags: parseList(tags),
      paymentMethod: parseList(paymentMethod),
      ageMin: ageMin !== undefined && ageMin !== "" ? Number(ageMin) : undefined,
      ageMax: ageMax !== undefined && ageMax !== "" ? Number(ageMax) : undefined,
      dateStart: dateStart || undefined,
      dateEnd: dateEnd || undefined,
    };

    const params = {
      search: search || "",
      filters,
      sortField,
      sortOrder: sortOrder === "asc" ? "asc" : "desc",
      page: parseInt(page, 10) || 1,
      limit: Math.min(parseInt(limit, 10) || 10, 100), // Cap at 100
    };

    const { items, total } = await querySales(params);
    const totalPages = Math.max(1, Math.ceil(total / params.limit));

    res.json({
      data: items,
      meta: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages,
      },
    });
  } catch (err) {
    console.error("❌ getSales error:", err.stack || err);
    res.status(500).json({ message: "Internal server error" });
  }
};
