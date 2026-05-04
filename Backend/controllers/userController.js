import asyncHandler from "../middleware/asyncHandler.js";
import * as userService from "../services/userService.js";

export const getUsersForSidebar = asyncHandler(async (req, res) => {
	const contacts = await userService.getContactsForLoggedInUser(req.user._id);
	res.status(200).json(contacts);
});

export const addContact = asyncHandler(async (req, res) => {
	const result = await userService.addContactByUsername(req.user._id, req.validatedBody.username);
	res.status(200).json(result);
});
