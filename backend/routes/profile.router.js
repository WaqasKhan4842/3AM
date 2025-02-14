import express from "express";
import { createProfile } from "../controllers/profile.controller.js"
import authMiddleware from "../middlewares/middleware.js"

const router = express.Router();

// POST: Create a profile
router.post("/create", authMiddleware, createProfile);

export default router;
