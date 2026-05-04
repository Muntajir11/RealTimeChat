import asyncHandler from "../middleware/asyncHandler.js";
import * as reactionService from "../domain/reactions/reactionService.js";

export const getSymbols = asyncHandler(async (req, res) => {
	res.status(200).json({ symbols: reactionService.listAllowedReactionSymbols() });
});

export const postReaction = asyncHandler(async (req, res) => {
	const { symbol } = req.validatedBody;
	const doc = await reactionService.addReaction(req.user._id, req.params.messageId, symbol);
	res.status(201).json(doc);
});

export const deleteReaction = asyncHandler(async (req, res) => {
	const { symbol } = req.query;
	if (!symbol) {
		return res.status(400).json({ error: "symbol query required" });
	}
	await reactionService.removeReaction(req.user._id, req.params.messageId, symbol);
	res.status(200).json({ ok: true });
});

export const getReactions = asyncHandler(async (req, res) => {
	const payload = await reactionService.listReactionsForMessage(req.user._id, req.params.messageId);
	res.status(200).json(payload);
});

export const postBulk = asyncHandler(async (req, res) => {
	const { messageIds } = req.validatedBody;
	const rows = await reactionService.listReactionsBulkForMessages(req.user._id, messageIds);
	res.status(200).json(rows);
});

export const deleteAllMine = asyncHandler(async (req, res) => {
	const payload = await reactionService.clearAllReactionsOnMessage(req.user._id, req.params.messageId);
	res.status(200).json(payload);
});

export const getThreadSummary = asyncHandler(async (req, res) => {
	const sample = Number(req.query.sample) || 200;
	const rows = await reactionService.summarizeThreadReactions(req.user._id, req.params.peerId, sample);
	res.status(200).json(rows);
});

export const getCount = asyncHandler(async (req, res) => {
	const n = await reactionService.countReactionsOnMessage(req.params.messageId);
	res.status(200).json({ count: n });
});

export const getMine = asyncHandler(async (req, res) => {
	const rows = await reactionService.listMyReactionsOnMessage(req.user._id, req.params.messageId);
	res.status(200).json(rows);
});
