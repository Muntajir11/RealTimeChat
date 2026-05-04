import asyncHandler from "../middleware/asyncHandler.js";
import * as preferencesService from "../services/preferencesService.js";

export const getPreferences = asyncHandler(async (req, res) => {
	const doc = await preferencesService.getOrCreatePreferences(req.user._id);
	res.status(200).json(doc);
});

export const putPreferences = asyncHandler(async (req, res) => {
	const doc = await preferencesService.updatePreferences(req.user._id, req.validatedBody);
	res.status(200).json(doc);
});
