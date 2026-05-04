import asyncHandler from "../middleware/asyncHandler.js";
import * as messageService from "../services/messageService.js";

export const sendMessage = asyncHandler(async (req, res) => {
	const { id: receiverId } = req.params;
	const { message } = req.validatedBody;
	const newMessage = await messageService.sendMessageForUser({
		senderId: req.user._id,
		receiverId,
		text: message,
	});
	res.status(201).json(newMessage);
});

export const getMessages = asyncHandler(async (req, res) => {
	const { id: userToChatId } = req.params;
	const messages = await messageService.getMessagesForConversation(req.user._id, userToChatId);
	res.status(200).json(messages);
});
