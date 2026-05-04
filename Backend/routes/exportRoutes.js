import express from "express";
import { z } from "zod";
import protectRoute from "../middleware/protectRoute.js";
import { validateParams } from "../middleware/validateRequest.js";
import {
	getConvCount,
	getCsv,
	getJson,
	getNdjson,
	getPeers,
	getPretty,
	getSummary,
	getVerify,
} from "../controllers/exportController.js";

const router = express.Router();
const peerParam = z.object({ peerId: z.string().min(1) });

router.get("/peers", protectRoute, getPeers);
router.get("/conversations/count", protectRoute, getConvCount);

router.get("/peer/:peerId.json", protectRoute, validateParams(peerParam), getJson);
router.get("/peer/:peerId.ndjson", protectRoute, validateParams(peerParam), getNdjson);
router.get("/peer/:peerId.pretty", protectRoute, validateParams(peerParam), getPretty);
router.get("/peer/:peerId/summary", protectRoute, validateParams(peerParam), getSummary);
router.get("/peer/:peerId/verify", protectRoute, validateParams(peerParam), getVerify);
router.get("/peer/:peerId.csv", protectRoute, validateParams(peerParam), getCsv);

export default router;
