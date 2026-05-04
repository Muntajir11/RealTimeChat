import asyncHandler from "../middleware/asyncHandler.js";
import * as profileService from "../services/profileService.js";

export const getProfile = asyncHandler(async (req, res) => {
	const profile = await profileService.getProfileForUser(req.user._id);
	res.status(200).json(profile);
});

export const patchProfile = asyncHandler(async (req, res) => {
	const { fullName } = req.validatedBody;
	const profile = await profileService.updateProfileFullName(req.user._id, fullName);
	res.status(200).json(profile);
});
