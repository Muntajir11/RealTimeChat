import asyncHandler from "../middleware/asyncHandler.js";
import BlockEntry from "../models/blockEntry.model.js";
import * as blockService from "../domain/blocking/blockService.js";

export const postBlock = asyncHandler(async (req, res) => {
	const { blockedId, reason } = req.validatedBody;
	const doc = await blockService.blockUser(req.user._id, blockedId, reason);
	res.status(201).json(doc);
});

export const deleteBlock = asyncHandler(async (req, res) => {
	const { blockedId } = req.validatedParams;
	await blockService.unblockUser(req.user._id, blockedId);
	res.status(200).json({ ok: true });
});

export const getBlockedList = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const pageSize = Number(req.query.pageSize) || 25;
	const payload = await blockService.listBlockedUsers(req.user._id, { page, pageSize });
	res.status(200).json(payload);
});

export const getBlockSummary = asyncHandler(async (req, res) => {
	const otherUserId = req.params.userId;
	const payload = await blockService.getBlockSummary(req.user._id, otherUserId);
	res.status(200).json(payload);
});

export const getBlockStats = asyncHandler(async (req, res) => {
	const payload = await blockService.getSelfBlockStats(req.user._id);
	res.status(200).json(payload);
});

export const getBlockRecord = asyncHandler(async (req, res) => {
	const { blockedId } = req.validatedParams;
	const row = await blockService.lookupBlockRecord(req.user._id, blockedId);
	if (!row) {
		return res.status(404).json({ error: "Not found" });
	}
	res.status(200).json(row);
});

export const postBulkPreview = asyncHandler(async (req, res) => {
	const { usernames } = req.validatedBody;
	const rows = await blockService.bulkResolveTargetsForBlocker(req.user._id, usernames);
	res.status(200).json({ items: rows });
});

export const postPruneOrphans = asyncHandler(async (req, res) => {
	const result = await blockService.pruneOrphanBlockReferences();
	res.status(200).json(result);
});

export const getExportCsv = asyncHandler(async (req, res) => {
	const csv = await blockService.exportBlockListCsv(req.user._id);
	res.setHeader("Content-Type", "text/csv");
	res.status(200).send(csv);
});

export const getCountBetween = asyncHandler(async (req, res) => {
	const other = req.params.userId;
	const n = await blockService.countBlocksBetweenPair(req.user._id, other);
	res.status(200).json({ count: n });
});

export const getRecentBetween = asyncHandler(async (req, res) => {
	const other = req.params.userId;
	const windowMs = Number(req.query.windowMs) || 86400000;
	const rows = await blockService.listRecentBlockEventsBetween(req.user._id, other, windowMs);
	res.status(200).json(rows);
});

export const getBlockTotals = asyncHandler(async (req, res) => {
	const [incoming, outgoing] = await Promise.all([
		BlockEntry.countIncomingBlocks(req.user._id),
		BlockEntry.countOutgoingBlocks(req.user._id),
	]);
	res.status(200).json({ incoming, outgoing });
});
