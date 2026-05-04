import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody, validateParams } from "../middleware/validateRequest.js";
import {
	blockCreateBodySchema,
	blockedIdParamSchema,
	bulkBlockPreviewSchema,
} from "../validators/featuresSchemas.js";
import {
	deleteBlock,
	getBlockedList,
	getBlockRecord,
	getBlockStats,
	getBlockSummary,
	getBlockTotals,
	getCountBetween,
	getExportCsv,
	getRecentBetween,
	postBlock,
	postBulkPreview,
	postPruneOrphans,
} from "../controllers/blockController.js";
import { z } from "zod";

const userIdParamSchema = z.object({ userId: z.string().min(1) });

const router = express.Router();

router.get("/totals", protectRoute, getBlockTotals);
router.get("/export.csv", protectRoute, getExportCsv);
router.get("/list", protectRoute, getBlockedList);
router.get("/stats", protectRoute, getBlockStats);
router.get("/summary/:userId", protectRoute, validateParams(userIdParamSchema), getBlockSummary);
router.get("/count/:userId", protectRoute, validateParams(userIdParamSchema), getCountBetween);
router.get("/recent/:userId", protectRoute, validateParams(userIdParamSchema), getRecentBetween);
router.get("/record/:blockedId", protectRoute, validateParams(blockedIdParamSchema), getBlockRecord);

router.post("/", protectRoute, validateBody(blockCreateBodySchema), postBlock);
router.post("/bulk-preview", protectRoute, validateBody(bulkBlockPreviewSchema), postBulkPreview);
router.post("/maintenance/prune-orphans", protectRoute, postPruneOrphans);

router.delete("/:blockedId", protectRoute, validateParams(blockedIdParamSchema), deleteBlock);

export default router;
