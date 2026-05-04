import express from "express";
import { z } from "zod";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validateRequest.js";
import {
	globalSearchQuerySchema,
	searchPhraseBodySchema,
	searchQuerySchema,
} from "../validators/featuresSchemas.js";
import {
	getGlobal,
	getInboxSearch,
	getNdjsonExport,
	getOutboxSearch,
	getPopularTerms,
	getRecentIds,
	getThreadCount,
	getThreadSearch,
	postExactPhrase,
} from "../controllers/searchController.js";

const router = express.Router();
const peerParam = z.object({ peerId: z.string().min(1) });

router.get("/global", protectRoute, validateQuery(globalSearchQuerySchema), getGlobal);
router.get("/outbox", protectRoute, validateQuery(searchQuerySchema), getOutboxSearch);
router.get("/inbox", protectRoute, validateQuery(searchQuerySchema), getInboxSearch);

router.get("/thread/:peerId", protectRoute, validateParams(peerParam), validateQuery(searchQuerySchema), getThreadSearch);
router.get("/thread/:peerId/count", protectRoute, validateParams(peerParam), validateQuery(searchQuerySchema), getThreadCount);
router.get("/thread/:peerId/terms", protectRoute, validateParams(peerParam), getPopularTerms);
router.get("/thread/:peerId/recent-ids", protectRoute, validateParams(peerParam), getRecentIds);
router.get("/thread/:peerId/export.ndjson", protectRoute, validateParams(peerParam), validateQuery(searchQuerySchema), getNdjsonExport);
router.post(
	"/thread/:peerId/exact",
	protectRoute,
	validateParams(peerParam),
	validateBody(searchPhraseBodySchema),
	postExactPhrase,
);

export default router;
