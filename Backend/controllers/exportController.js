import asyncHandler from "../middleware/asyncHandler.js";
import * as exportService from "../domain/export/chatExportService.js";

export const getJson = asyncHandler(async (req, res) => {
	const maxMessages = Number(req.query.maxMessages) || 5000;
	const bundle = await exportService.buildPeerThreadExport(req.user._id, req.params.peerId, { maxMessages });
	res.status(200).json(bundle);
});

export const getNdjson = asyncHandler(async (req, res) => {
	const maxMessages = Number(req.query.maxMessages) || 5000;
	await exportService.streamPeerExportNdjson(res, req.user._id, req.params.peerId, maxMessages);
});

export const getPretty = asyncHandler(async (req, res) => {
	const json = await exportService.exportJsonAttachment(req.user._id, req.params.peerId);
	res.setHeader("Content-Type", "application/json");
	res.status(200).send(json);
});

export const getSummary = asyncHandler(async (req, res) => {
	const payload = await exportService.summarizeThreadSizes(req.user._id, req.params.peerId);
	res.status(200).json(payload);
});

export const getPeers = asyncHandler(async (req, res) => {
	const limit = Number(req.query.limit) || 50;
	const rows = await exportService.listExportablePeers(req.user._id, limit);
	res.status(200).json(rows);
});

export const getVerify = asyncHandler(async (req, res) => {
	const payload = await exportService.verifyPeerHasHistory(req.user._id, req.params.peerId);
	res.status(200).json(payload);
});

export const getCsv = asyncHandler(async (req, res) => {
	const csv = await exportService.exportCsvSummary(req.user._id, req.params.peerId);
	res.setHeader("Content-Type", "text/csv");
	res.status(200).send(csv);
});

export const getConvCount = asyncHandler(async (req, res) => {
	const n = await exportService.countConversationsTouchingUser(req.user._id);
	res.status(200).json({ count: n });
});
