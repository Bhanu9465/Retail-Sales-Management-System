import { useEffect, useState, useCallback } from "react";
import { fetchSales } from "../services/api";

/**
 * Custom hook for managing sales query state
 * Handles search, filters, sorting, pagination, and data fetching
 */
export const useSalesQuery = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    category: [],
    tags: [],
    paymentMethod: [],
    ageMin: "",
    ageMax: "",
    dateStart: "",
    dateEnd: "",
  });
  const [sort, setSort] = useState({ field: "date", order: "desc" });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        search: search || undefined,
        page,
        limit,
        sortField: sort.field,
        sortOrder: sort.order,
        region: filters.region.length ? filters.region.join(",") : undefined,
        gender: filters.gender.length ? filters.gender.join(",") : undefined,
        category: filters.category.length ? filters.category.join(",") : undefined,
        tags: filters.tags.length ? filters.tags.join(",") : undefined,
        paymentMethod: filters.paymentMethod.length ? filters.paymentMethod.join(",") : undefined,
        ageMin: filters.ageMin || undefined,
        ageMax: filters.ageMax || undefined,
        dateStart: filters.dateStart || undefined,
        dateEnd: filters.dateEnd || undefined,
      };

      // Remove undefined params
      Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

      const res = await fetchSales(params);
      setData(res.data || []);
      setMeta(res.meta || { total: 0, page: 1, limit: 10, totalPages: 1 });
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [search, filters, sort, page, limit]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      region: [],
      gender: [],
      category: [],
      tags: [],
      paymentMethod: [],
      ageMin: "",
      ageMax: "",
      dateStart: "",
      dateEnd: "",
    });
    setSearch("");
    setPage(1);
  };

  return {
    search,
    setSearch,
    filters,
    updateFilter,
    resetFilters,
    sort,
    setSort,
    page,
    setPage,
    data,
    meta,
    loading,
    error,
  };
};
