import express from "express";
import { getRecommendations } from "../controllers/recommendController.js";
import auth from "../middleware/middleware.js";

const router = express.Router();

// GET recommendations for a user (AI-based, pagination supported)
router.get("/", auth, getRecommendations);

export default router;
