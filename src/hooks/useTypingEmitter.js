import { useCallback, useEffect, useRef } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { SOCKET_EVENT_TYPING_START, SOCKET_EVENT_TYPING_STOP } from "../constants/socketEvents.js";

const DEBOUNCE_MS = 600;

export function useTypingEmitter() {
	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();
	const timerRef = useRef(null);

	const emitStop = useCallback(() => {
		if (!socket || !selectedConversation?._id) return;
		socket.emit(SOCKET_EVENT_TYPING_STOP, { toUserId: selectedConversation._id });
	}, [socket, selectedConversation?._id]);

	const notifyTyping = useCallback(() => {
		if (!socket || !selectedConversation?._id) return;
		socket.emit(SOCKET_EVENT_TYPING_START, { toUserId: selectedConversation._id });
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			emitStop();
		}, DEBOUNCE_MS);
	}, [socket, selectedConversation?._id, emitStop]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
			emitStop();
		};
	}, [emitStop, selectedConversation?._id]);

	return { notifyTyping, emitStop };
}
