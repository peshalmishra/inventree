import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  generateDescription,
  generateTags,
  generateCaption,
  recommendPrice,
  generateTrending
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/description", protect, generateDescription);
router.post("/tags", protect, generateTags);
router.post("/caption", protect, generateCaption);
router.post("/pricing", protect, recommendPrice);
router.post("/trending", protect, generateTrending);

export default router;
