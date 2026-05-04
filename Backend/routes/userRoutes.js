import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { addContact, getUsersForSidebar } from "../controllers/userController.js";
import { validateBody } from "../middleware/validateRequest.js";
import { addContactBodySchema } from "../validators/userSchemas.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.post("/add-contact", protectRoute, validateBody(addContactBodySchema), addContact);

export default router;
