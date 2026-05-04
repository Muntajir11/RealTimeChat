import { SOCKET_EVENT_GET_ONLINE_USERS } from "../constants/socketEvents.js";
import * as registry from "./userSocketRegistry.js";
import { registerTypingHandlers } from "./handlers/typingHandlers.js";

export function registerSocketHandlers(io) {
	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;
		registry.setUserSocket(userId, socket.id);
		io.emit(SOCKET_EVENT_GET_ONLINE_USERS, registry.getOnlineUserIds());

		registerTypingHandlers(io, socket);

		socket.on("disconnect", () => {
			registry.removeUserSocket(userId);
			io.emit(SOCKET_EVENT_GET_ONLINE_USERS, registry.getOnlineUserIds());
		});
	});
}