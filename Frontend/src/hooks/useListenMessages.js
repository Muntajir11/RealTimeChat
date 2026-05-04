import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";
import { SOCKET_EVENT_NEW_MESSAGE } from "../constants/socketEvents.js";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages } = useConversation();

	useEffect(() => {
		if (!socket) return undefined;

		const handler = (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			setMessages((prev) => [...prev, newMessage]);
		};

		socket.on(SOCKET_EVENT_NEW_MESSAGE, handler);

		return () => {
			socket.off(SOCKET_EVENT_NEW_MESSAGE, handler);
		};
	}, [socket, setMessages]);
};
export default useListenMessages;
