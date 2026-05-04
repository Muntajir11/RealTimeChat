import express from "express";
import { z } from "zod";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody, validateParams } from "../middleware/validateRequest.js";
import {
	reportCreateBodySchema,
	reportIdParamSchema,
	reportStatusBodySchema,
} from "../validators/featuresSchemas.js";
import {
	deleteReport,
	getCountSince,
	getExportNdjson,
	getMyReports,
	getOpenAgainstUser,
	getOpenSummary,
	getPeerHistory,
	getReasonCodes,
	getReport,
	patchReportStatus,
	postAttachEvidence,
	postReopen,
	postReport,
} from "../controllers/reportController.js";

const router = express.Router();
const userIdParam = z.object({ userId: z.string().min(1) });
const attachBody = z.object({ messageId: z.string().min(1) });

router.get("/reasons", protectRoute, getReasonCodes);
router.get("/mine", protectRoute, getMyReports);
router.get("/open/summary", protectRoute, getOpenSummary);
router.get("/open/against/:userId", protectRoute, validateParams(userIdParam), getOpenAgainstUser);
router.get("/peer/:userId", protectRoute, validateParams(userIdParam), getPeerHistory);
router.get("/export.ndjson", protectRoute, getExportNdjson);
router.get("/count/:userId", protectRoute, validateParams(userIdParam), getCountSince);

router.post("/", protectRoute, validateBody(reportCreateBodySchema), postReport);
router.post("/:reportId/reopen", protectRoute, validateParams(reportIdParamSchema), postReopen);
router.post(
	"/:reportId/evidence",
	protectRoute,
	validateParams(reportIdParamSchema),
	validateBody(attachBody),
	postAttachEvidence,
);

router.get("/:reportId", protectRoute, validateParams(reportIdParamSchema), getReport);
router.patch(
	"/:reportId/status",
	protectRoute,
	validateParams(reportIdParamSchema),
	validateBody(reportStatusBodySchema),
	patchReportStatus,
);
router.delete("/:reportId", protectRoute, validateParams(reportIdParamSchema), deleteReport);

export default router;
