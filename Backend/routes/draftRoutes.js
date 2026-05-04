import express from "express";
import { z } from "zod";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody, validateParams } from "../middleware/validateRequest.js";
import { draftAppendBodySchema, draftUpsertBodySchema } from "../validators/featuresSchemas.js";
import {
	deleteAll,
	deleteDraft,
	getChars,
	getDraft,
	getExists,
	getList,
	getPeers,
	getSnapshot,
	postAppend,
	postCopy,
	postPurge,
	putDraft,
} from "../controllers/draftController.js";

const router = express.Router();
const peerParam = z.object({ peerId: z.string().min(1) });
const copyBody = z.object({ fromPeerId: z.string().min(1), toPeerId: z.string().min(1) });

router.get("/list", protectRoute, getList);
router.get("/chars", protectRoute, getChars);
router.get("/peers", protectRoute, getPeers);
router.post("/purge", protectRoute, postPurge);
router.post("/copy", protectRoute, validateBody(copyBody), postCopy);
router.delete("/all", protectRoute, deleteAll);

router.get("/:peerId/exists", protectRoute, validateParams(peerParam), getExists);
router.post("/:peerId/append", protectRoute, validateParams(peerParam), validateBody(draftAppendBodySchema), postAppend);
router.get("/:peerId/snapshot", protectRoute, validateParams(peerParam), getSnapshot);
router.get("/:peerId", protectRoute, validateParams(peerParam), getDraft);
router.put("/:peerId", protectRoute, validateParams(peerParam), validateBody(draftUpsertBodySchema), putDraft);
router.delete("/:peerId", protectRoute, validateParams(peerParam), deleteDraft);

export default router;
