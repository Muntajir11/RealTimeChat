const userSocketMap = Object.create(null);

export function getReceiverSocketId(receiverId) {
	return userSocketMap[receiverId];
}

export function setUserSocket(userId, socketId) {
	if (userId && userId !== "undefined") {
		userSocketMap[userId] = socketId;
	}
}

export function removeUserSocket(userId) {
	delete userSocketMap[userId];
}

export function getOnlineUserIds() {
	return Object.keys(userSocketMap);
}
