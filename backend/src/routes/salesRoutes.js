import express from "express";
import { getSales } from "../controllers/salesController.js";

const router = express.Router();

// Single endpoint: GET /api/sales
router.get("/", getSales);

export default router;
