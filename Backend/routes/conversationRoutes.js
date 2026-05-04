import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getConversations } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", protectRoute, getConversations);

export default router;
