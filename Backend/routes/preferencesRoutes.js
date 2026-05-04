import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { validateBody } from "../middleware/validateRequest.js";
import { getPreferences, putPreferences } from "../controllers/preferencesController.js";
import { putPreferencesBodySchema } from "../validators/preferencesSchemas.js";

const router = express.Router();

router.get("/", protectRoute, getPreferences);
router.put("/", protectRoute, validateBody(putPreferencesBodySchema), putPreferences);

export default router;
