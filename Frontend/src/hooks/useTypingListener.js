import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";
import { SOCKET_EVENT_TYPING_START, SOCKET_EVENT_TYPING_STOP } from "../constants/socketEvents.js";

export function useTypingListener() {
	const { socket } = useSocketContext();
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const [peerTyping, setPeerTyping] = useState(false);

	useEffect(() => {
		if (!socket || !selectedConversation?._id || !authUser) {
			setPeerTyping(false);
			return undefined;
		}

		const peerId = String(selectedConversation._id);

		const onStart = (payload) => {
			if (String(payload?.fromUserId) === peerId) setPeerTyping(true);
		};
		const onStop = (payload) => {
			if (String(payload?.fromUserId) === peerId) setPeerTyping(false);
		};

		socket.on(SOCKET_EVENT_TYPING_START, onStart);
		socket.on(SOCKET_EVENT_TYPING_STOP, onStop);

		return () => {
			socket.off(SOCKET_EVENT_TYPING_START, onStart);
			socket.off(SOCKET_EVENT_TYPING_STOP, onStop);
		};
	}, [socket, selectedConversation?._id, authUser]);

	return peerTyping;
}
