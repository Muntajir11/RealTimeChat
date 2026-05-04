import asyncHandler from "../middleware/asyncHandler.js";
import * as pinService from "../domain/pins/pinService.js";

export const postPin = asyncHandler(async (req, res) => {
	const { messageId, note } = req.validatedBody;
	const doc = await pinService.pinMessage(req.user._id, req.params.peerId, messageId, note);
	res.status(201).json(doc);
});

export const deletePin = asyncHandler(async (req, res) => {
	await pinService.unpinMessage(req.user._id, req.params.peerId, req.params.messageId);
	res.status(200).json({ ok: true });
});

export const getPins = asyncHandler(async (req, res) => {
	const rows = await pinService.listPins(req.user._id, req.params.peerId);
	res.status(200).json(rows);
});

export const getAllPins = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const pageSize = Number(req.query.pageSize) || 30;
	const payload = await pinService.listAllPinsForOwner(req.user._id, page, pageSize);
	res.status(200).json(payload);
});

export const getHas = asyncHandler(async (req, res) => {
	const exists = await pinService.hasPinned(req.user._id, req.params.peerId, req.params.messageId);
	res.status(200).json({ pinned: exists });
});

export const patchNote = asyncHandler(async (req, res) => {
	const { note } = req.validatedBody;
	const doc = await pinService.replacePinNote(req.user._id, req.params.peerId, req.params.messageId, note);
	res.status(200).json(doc);
});

export const getCount = asyncHandler(async (req, res) => {
	const n = await pinService.countPinsForPeer(req.user._id, req.params.peerId);
	res.status(200).json({ count: n });
});

export const getExport = asyncHandler(async (req, res) => {
	const json = await pinService.exportPinsAsJson(req.user._id, req.params.peerId);
	res.setHeader("Content-Type", "application/json");
	res.status(200).send(json);
});

export const getOrder = asyncHandler(async (req, res) => {
	const payload = await pinService.reorderPinsNotSupported(req.user._id, req.params.peerId);
	res.status(200).json(payload);
});
