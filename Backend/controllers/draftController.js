import asyncHandler from "../middleware/asyncHandler.js";
import * as draftService from "../domain/drafts/draftService.js";

export const putDraft = asyncHandler(async (req, res) => {
	const { body, clientNonce } = req.validatedBody;
	const doc = await draftService.saveDraft(req.user._id, req.params.peerId, body, clientNonce);
	res.status(200).json(doc);
});

export const getDraft = asyncHandler(async (req, res) => {
	const doc = await draftService.getDraft(req.user._id, req.params.peerId);
	if (!doc) {
		return res.status(404).json({ error: "No draft" });
	}
	res.status(200).json(doc);
});

export const deleteDraft = asyncHandler(async (req, res) => {
	await draftService.deleteDraft(req.user._id, req.params.peerId);
	res.status(200).json({ ok: true });
});

export const getList = asyncHandler(async (req, res) => {
	const limit = Number(req.query.limit) || 80;
	const rows = await draftService.listDrafts(req.user._id, limit);
	res.status(200).json(rows);
});

export const getChars = asyncHandler(async (req, res) => {
	const n = await draftService.totalDraftCharacters(req.user._id);
	res.status(200).json({ totalChars: n });
});

export const postPurge = asyncHandler(async (req, res) => {
	const maxAgeMs = Number(req.body.maxAgeMs) || 86400000 * 90;
	const payload = await draftService.purgeStaleDrafts(maxAgeMs);
	res.status(200).json(payload);
});

export const postCopy = asyncHandler(async (req, res) => {
	const { fromPeerId, toPeerId } = req.validatedBody;
	const doc = await draftService.copyDraftBetweenPeers(req.user._id, fromPeerId, toPeerId);
	res.status(201).json(doc);
});

export const getPeers = asyncHandler(async (req, res) => {
	const ids = await draftService.listPeersWithDrafts(req.user._id);
	res.status(200).json({ peerIds: ids });
});

export const getExists = asyncHandler(async (req, res) => {
	const ok = await draftService.existsDraft(req.user._id, req.params.peerId);
	res.status(200).json({ exists: ok });
});

export const postAppend = asyncHandler(async (req, res) => {
	const { append } = req.validatedBody;
	const doc = await draftService.appendToDraft(req.user._id, req.params.peerId, append);
	res.status(200).json(doc);
});

export const deleteAll = asyncHandler(async (req, res) => {
	const payload = await draftService.wipeAllDraftsForUser(req.user._id);
	res.status(200).json(payload);
});

export const getSnapshot = asyncHandler(async (req, res) => {
	const snap = await draftService.snapshotDraftForExport(req.user._id, req.params.peerId);
	res.status(200).json(snap);
});
