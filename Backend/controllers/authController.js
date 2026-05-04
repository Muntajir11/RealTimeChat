import { JWT_COOKIE_NAME } from "../constants/cookies.js";
import asyncHandler from "../middleware/asyncHandler.js";
import * as authService from "../services/authService.js";

export const signup = asyncHandler(async (req, res) => {
	const payload = await authService.signupUser(req.validatedBody, res);
	res.status(201).json(payload);
});

export const login = asyncHandler(async (req, res) => {
	const payload = await authService.loginUser(req.validatedBody, res);
	res.status(201).json(payload);
});

export const logout = (req, res) => {
	try {
		res.cookie(JWT_COOKIE_NAME, "", { maxAge: 0 });
		res.status(200).json({ message: "Logged Out Successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
