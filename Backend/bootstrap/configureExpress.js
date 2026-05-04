import path from "path";
import cookieParser from "cookie-parser";
import express from "express";

import errorHandler from "../middleware/errorHandler.js";
import attachmentRoutes from "../routes/attachmentRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import blockRoutes from "../routes/blockRoutes.js";
import conversationRoutes from "../routes/conversationRoutes.js";
import draftRoutes from "../routes/draftRoutes.js";
import exportRoutes from "../routes/exportRoutes.js";
import healthRoutes from "../routes/healthRoutes.js";
import messageRoutes from "../routes/messageRoutes.js";
import pinRoutes from "../routes/pinRoutes.js";
import preferencesRoutes from "../routes/preferencesRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
import reactionRoutes from "../routes/reactionRoutes.js";
import reportRoutes from "../routes/reportRoutes.js";
import searchRoutes from "../routes/searchRoutes.js";
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
	app.use("/api/blocks", blockRoutes);
	app.use("/api/reports", reportRoutes);
	app.use("/api/reactions", reactionRoutes);
	app.use("/api/pins", pinRoutes);
	app.use("/api/drafts", draftRoutes);
	app.use("/api/attachments", attachmentRoutes);
	app.use("/api/search/messages", searchRoutes);
	app.use("/api/export", exportRoutes);

	app.use(express.static(path.join(__dirname, "/Frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
	});

	app.use(errorHandler);
}
