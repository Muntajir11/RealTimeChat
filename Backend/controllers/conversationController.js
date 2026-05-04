import asyncHandler from "../middleware/asyncHandler.js";
import * as conversationService from "../services/conversationService.js";

export const getConversations = asyncHandler(async (req, res) => {
	const list = await conversationService.listConversationsForUser(req.user._id);
	res.status(200).json(list);
});
