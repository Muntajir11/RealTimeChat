import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody } from "../middleware/validateRequest.js";
import { getProfile, patchProfile } from "../controllers/profileController.js";
import { patchProfileBodySchema } from "../validators/profileSchemas.js";

const router = express.Router();

router.get("/", protectRoute, getProfile);
router.patch("/", protectRoute, validateBody(patchProfileBodySchema), patchProfile);

export default router;
