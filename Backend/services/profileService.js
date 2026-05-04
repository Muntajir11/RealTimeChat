import User from "../models/user.model.js";
import { HttpError } from "../errors/HttpError.js";

export async function getProfileForUser(userId) {
	const user = await User.findById(userId).select("-password");
	if (!user) throw new HttpError(404, "User not found");
	return {
		_id: user._id,
		fullName: user.fullName,
		username: user.username,
		email: user.email,
		profilePic: user.profilePic,
		gender: user.gender,
	};
}

export async function updateProfileFullName(userId, fullName) {
	const user = await User.findById(userId);
	if (!user) throw new HttpError(404, "User not found");
	user.fullName = fullName;
	await user.save();
	return getProfileForUser(userId);
}
