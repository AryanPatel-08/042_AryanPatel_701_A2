import express from "express";
import { applyLeave, listLeaves } from "../controllers/leaveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyLeave);
router.get("/list", authMiddleware, listLeaves);

export default router;
