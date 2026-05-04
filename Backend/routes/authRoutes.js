import express from "express";
import { login, logout, signup } from "../controllers/authController.js";
import { validateBody } from "../middleware/validateRequest.js";
import { loginBodySchema, signupBodySchema } from "../validators/authSchemas.js";

const router = express.Router();

router.post("/signup", validateBody(signupBodySchema), signup);
router.post("/login", validateBody(loginBodySchema), login);
router.post("/logout", logout);

export default router;
