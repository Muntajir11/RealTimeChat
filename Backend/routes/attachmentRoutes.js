import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody, validateParams } from "../middleware/validateRequest.js";
import {
	attachmentIdParamSchema,
	attachmentRegisterBodySchema,
	attachmentReplaceBodySchema,
	messageIdParamSchema,
} from "../validators/featuresSchemas.js";
import {
	deleteAll,
	deleteOne,
	getImages,
	getList,
	getOversized,
	getRecent,
	getStorage,
	getSum,
	patchMeta,
	postRegister,
	putReplace,
} from "../controllers/attachmentController.js";

const router = express.Router();

router.get("/recent", protectRoute, getRecent);
router.get("/storage/me", protectRoute, getStorage);

router.post(
	"/message/:messageId",
	protectRoute,
	validateParams(messageIdParamSchema),
	validateBody(attachmentRegisterBodySchema),
	postRegister,
);
router.get("/message/:messageId", protectRoute, validateParams(messageIdParamSchema), getList);
router.put(
	"/message/:messageId/replace",
	protectRoute,
	validateParams(messageIdParamSchema),
	validateBody(attachmentReplaceBodySchema),
	putReplace,
);
router.get("/message/:messageId/sum", protectRoute, validateParams(messageIdParamSchema), getSum);
router.get("/message/:messageId/images", protectRoute, validateParams(messageIdParamSchema), getImages);
router.get("/message/:messageId/oversized", protectRoute, validateParams(messageIdParamSchema), getOversized);
router.delete("/message/:messageId/all", protectRoute, validateParams(messageIdParamSchema), deleteAll);

router.delete("/:attachmentId", protectRoute, validateParams(attachmentIdParamSchema), deleteOne);
router.patch("/:attachmentId", protectRoute, validateParams(attachmentIdParamSchema), patchMeta);

export default router;
