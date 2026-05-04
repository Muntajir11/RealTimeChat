import { Server } from "socket.io";
import http from "http";
import express from "express";
import { getCorsOriginList } from "../config/env.js";
import { registerSocketHandlers } from "./registerSocketHandlers.js";
import { getReceiverSocketId } from "./userSocketRegistry.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: getCorsOriginList(),
		methods: ["GET", "POST"],
	},
});

registerSocketHandlers(io);

export { app, io, server, getReceiverSocketId };
