import User from "../models/user.model.js";
import { HttpError } from "../errors/HttpError.js";

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getContactsForLoggedInUser(loggedInUserId) {
	const loggedInUser = await User.findById(loggedInUserId).populate("contacts", "-password");
	if (!loggedInUser) {
		throw new HttpError(404, "User not found");
	}
	return loggedInUser.contacts;
}

export async function addContactByUsername(loggedInUserId, username) {
	const userToAdd = await User.findOne({ username: new RegExp(`^${escapeRegex(username)}$`, "i") });
	if (!userToAdd) {
		throw new HttpError(404, "User not found");
	}

	const loggedInUser = await User.findById(loggedInUserId);
	if (!loggedInUser) {
		throw new HttpError(404, "Logged-in user not found");
	}

	if (userToAdd._id.equals(loggedInUser._id)) {
		throw new HttpError(400, "You cannot add yourself as a contact");
	}

	if (loggedInUser.contacts.includes(userToAdd._id)) {
		throw new HttpError(400, "User is already a contact");
	}

	if (userToAdd.contacts.includes(loggedInUser._id)) {
		throw new HttpError(400, "User is already a contact");
	}

	loggedInUser.contacts.push(userToAdd._id);
	userToAdd.contacts.push(loggedInUser._id);
	await Promise.all([loggedInUser.save(), userToAdd.save()]);

	return { message: "Contact added successfully. Refresh!" };
}
