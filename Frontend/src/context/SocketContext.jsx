import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { getSocketBaseUrl } from "../config/clientEnv.js";
import { SOCKET_EVENT_GET_ONLINE_USERS } from "../constants/socketEvents.js";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (!authUser) {
			setSocket(null);
			return undefined;
		}

		const s = io(getSocketBaseUrl(), {
			query: {
				userId: authUser._id,
			},
		});

		setSocket(s);

		s.on(SOCKET_EVENT_GET_ONLINE_USERS, (users) => {
			setOnlineUsers(users);
		});

		return () => {
			s.close();
			setSocket(null);
		};
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
