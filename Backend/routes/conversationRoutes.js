import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getConversations } from '../controllers/conversationController.js';

const router = express.Router();

// Route to get conversations for the logged-in user
router.get("/conversations", protectRoute, getConversations);

export default router;
