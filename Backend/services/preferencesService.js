import UserPreferences from "../models/userPreferences.model.js";

const defaultDoc = (userId) => ({
	user: userId,
	desktopNotifications: true,
	messageSound: true,
	showOnlineStatus: true,
	enterToSend: true,
});

export async function getOrCreatePreferences(userId) {
	let doc = await UserPreferences.findOne({ user: userId });
	if (!doc) {
		doc = await UserPreferences.create(defaultDoc(userId));
	}
	return doc;
}

export async function updatePreferences(userId, patch) {
	const doc = await getOrCreatePreferences(userId);
	Object.assign(doc, patch);
	await doc.save();
	return doc;
}
