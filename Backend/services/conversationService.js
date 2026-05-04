import { getContactsForLoggedInUser } from "./userService.js";

export async function listConversationsForUser(loggedInUserId) {
	return getContactsForLoggedInUser(loggedInUserId);
}
