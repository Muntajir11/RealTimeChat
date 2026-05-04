import path from "path";
import cookieParser from "cookie-parser";
import express from "express";

import errorHandler from "../middleware/errorHandler.js";
import authRoutes from "../routes/authRoutes.js";
import healthRoutes from "../routes/healthRoutes.js";
import conversationRoutes from "../routes/conversationRoutes.js";
import messageRoutes from "../routes/messageRoutes.js";
import preferencesRoutes from "../routes/preferencesRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
import userRoutes from "../routes/userRoutes.js";
const __dirname = path.resolve();

export default function configureExpress(app) {
	app.use(express.json());
	app.use(cookieParser());

	app.use("/api/health", healthRoutes);
	app.use("/api/auth", authRoutes);
	app.use("/api/messages", messageRoutes);
	app.use("/api/users", userRoutes);
	app.use("/api/conversations", conversationRoutes);
	app.use("/api/profile", profileRoutes);
	app.use("/api/preferences", preferencesRoutes);

	app.use(express.static(path.join(__dirname, "/Frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
	});

	app.use(errorHandler);
}
