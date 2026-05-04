import express from "express";
import { z } from "zod";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody, validateParams } from "../middleware/validateRequest.js";
import { messageIdParamSchema, pinCreateBodySchema, pinNotePatchSchema } from "../validators/featuresSchemas.js";
import {
	deletePin,
	getAllPins,
	getCount,
	getExport,
	getHas,
	getOrder,
	getPins,
	patchNote,
	postPin,
} from "../controllers/pinController.js";

const router = express.Router();
const peerParam = z.object({ peerId: z.string().min(1) });
const peerMsgParam = z.object({ peerId: z.string().min(1), messageId: z.string().min(1) });

router.get("/all", protectRoute, getAllPins);

router.get("/peer/:peerId", protectRoute, validateParams(peerParam), getPins);
router.get("/peer/:peerId/count", protectRoute, validateParams(peerParam), getCount);
router.get("/peer/:peerId/export.json", protectRoute, validateParams(peerParam), getExport);
router.get("/peer/:peerId/order", protectRoute, validateParams(peerParam), getOrder);
router.post("/peer/:peerId", protectRoute, validateParams(peerParam), validateBody(pinCreateBodySchema), postPin);
router.patch(
	"/peer/:peerId/message/:messageId/note",
	protectRoute,
	validateParams(peerMsgParam),
	validateBody(pinNotePatchSchema),
	patchNote,
);
router.get("/peer/:peerId/message/:messageId", protectRoute, validateParams(peerMsgParam), getHas);
router.delete("/peer/:peerId/message/:messageId", protectRoute, validateParams(peerMsgParam), deletePin);

export default router;
