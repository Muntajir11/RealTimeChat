import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	PORT: z.coerce.number().default(5000),
	MONGO_URI: z.string().min(1),
	JWT_SECRET: z.string().min(1),
	CORS_ORIGINS: z.string().optional(),
});

let cached;

export function getEnv() {
	if (cached && process.env.NODE_ENV !== "test") return cached;
	const mongoUri = process.env.MONGO_URI || process.env.MONGO_DB_URI;
	const result = envSchema.parse({
		NODE_ENV: process.env.NODE_ENV,
		PORT: process.env.PORT,
		MONGO_URI: mongoUri,
		JWT_SECRET: process.env.JWT_SECRET,
		CORS_ORIGINS: process.env.CORS_ORIGINS,
	});
	if (process.env.NODE_ENV !== "test") cached = result;
	return result;
}

export function getCorsOriginList() {
	const raw = getEnv().CORS_ORIGINS;
	if (raw) {
		return raw.split(",").map((s) => s.trim()).filter(Boolean);
	}
	return ["http://localhost:3000"];
}
