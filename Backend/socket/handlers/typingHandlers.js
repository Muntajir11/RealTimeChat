import {
	SOCKET_EVENT_TYPING_START,
	SOCKET_EVENT_TYPING_STOP,
} from "../../constants/socketEvents.js";
import { getReceiverSocketId } from "../userSocketRegistry.js";

export function registerTypingHandlers(io, socket) {
	const fromUserId = socket.handshake.query.userId;

	socket.on(SOCKET_EVENT_TYPING_START, (payload) => {
		const toUserId = payload?.toUserId;
		if (!toUserId || !fromUserId || fromUserId === "undefined") return;
		const sid = getReceiverSocketId(String(toUserId));
		if (sid) {
			io.to(sid).emit(SOCKET_EVENT_TYPING_START, { fromUserId });
		}
	});

	socket.on(SOCKET_EVENT_TYPING_STOP, (payload) => {
		const toUserId = payload?.toUserId;
		if (!toUserId || !fromUserId || fromUserId === "undefined") return;
		const sid = getReceiverSocketId(String(toUserId));
		if (sid) {
			io.to(sid).emit(SOCKET_EVENT_TYPING_STOP, { fromUserId });
		}
	});
}
