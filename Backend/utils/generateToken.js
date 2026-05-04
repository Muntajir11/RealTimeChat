import jwt from "jsonwebtoken";
import { getEnv } from "../config/env.js";
import { JWT_COOKIE_NAME } from "../constants/cookies.js";

const generateTokenAndSetCookie = (userId, res) => {
	const { JWT_SECRET, NODE_ENV } = getEnv();
	const token = jwt.sign({ userId }, JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie(JWT_COOKIE_NAME, token, {
		maxAge: 15 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: "strict",
		secure: NODE_ENV === "production",
	});
};

export default generateTokenAndSetCookie;
