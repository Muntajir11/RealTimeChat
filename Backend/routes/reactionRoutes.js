import express from "express";
import { z } from "zod";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody, validateParams } from "../middleware/validateRequest.js";
import { messageIdParamSchema, reactionBodySchema, reactionBulkBodySchema } from "../validators/featuresSchemas.js";
import {
	deleteAllMine,
	deleteReaction,
	getCount,
	getMine,
	getReactions,
	getSymbols,
	getThreadSummary,
	postBulk,
	postReaction,
} from "../controllers/reactionController.js";

const router = express.Router();
const peerParam = z.object({ peerId: z.string().min(1) });

router.get("/symbols", protectRoute, getSymbols);
router.get("/thread/:peerId/summary", protectRoute, validateParams(peerParam), getThreadSummary);

router.post("/bulk", protectRoute, validateBody(reactionBulkBodySchema), postBulk);

router.post("/:messageId", protectRoute, validateParams(messageIdParamSchema), validateBody(reactionBodySchema), postReaction);
router.get("/:messageId/count", protectRoute, validateParams(messageIdParamSchema), getCount);
router.get("/:messageId/mine", protectRoute, validateParams(messageIdParamSchema), getMine);
router.delete("/:messageId/all-mine", protectRoute, validateParams(messageIdParamSchema), deleteAllMine);
router.get("/:messageId", protectRoute, validateParams(messageIdParamSchema), getReactions);
router.delete("/:messageId", protectRoute, validateParams(messageIdParamSchema), deleteReaction);

export default router;
