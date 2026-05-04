import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody } from "../middleware/validateRequest.js";
import { sendMessageBodySchema } from "../validators/messageSchemas.js";

const router = express.Router();

router.post("/send/:id", protectRoute, validateBody(sendMessageBodySchema), sendMessage);
router.get("/:id", protectRoute, getMessages);

export default router;
