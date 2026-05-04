import asyncHandler from "../middleware/asyncHandler.js";
import * as searchService from "../domain/search/messageSearchService.js";

export const getThreadSearch = asyncHandler(async (req, res) => {
	const { q, limit, before } = req.validatedQuery;
	const rows = await searchService.searchMessagesForPeerThread(req.user._id, req.params.peerId, q, {
		limit,
		beforeId: before,
	});
	res.status(200).json(rows);
});

export const getOutboxSearch = asyncHandler(async (req, res) => {
	const { q, limit } = req.validatedQuery;
	const rows = await searchService.searchMyOutbox(req.user._id, q, limit);
	res.status(200).json(rows);
});

export const getInboxSearch = asyncHandler(async (req, res) => {
	const { q, limit } = req.validatedQuery;
	const rows = await searchService.searchMyInbox(req.user._id, q, limit);
	res.status(200).json(rows);
});

export const getThreadCount = asyncHandler(async (req, res) => {
	const { q } = req.validatedQuery;
	const n = await searchService.countMatchesForPeer(req.user._id, req.params.peerId, q);
	res.status(200).json({ count: n });
});

export const getPopularTerms = asyncHandler(async (req, res) => {
	const sample = Number(req.query.sample) || 500;
	const rows = await searchService.aggregatePopularTerms(req.user._id, req.params.peerId, sample);
	res.status(200).json(rows);
});

export const postExactPhrase = asyncHandler(async (req, res) => {
	const { phrase } = req.validatedBody;
	const rows = await searchService.findMessagesByExactPhrase(req.user._id, req.params.peerId, phrase);
	res.status(200).json(rows);
});

export const getRecentIds = asyncHandler(async (req, res) => {
	const limit = Number(req.query.limit) || 100;
	const rows = await searchService.listRecentIdsForPeer(req.user._id, req.params.peerId, limit);
	res.status(200).json(rows);
});

export const getGlobal = asyncHandler(async (req, res) => {
	const { q, limit } = req.validatedQuery;
	const rows = await searchService.searchAcrossAllContacts(req.user._id, q, limit);
	res.status(200).json(rows);
});

export const getNdjsonExport = asyncHandler(async (req, res) => {
	const { q, limit } = req.validatedQuery;
	const rows = await searchService.searchMessagesForPeerThread(req.user._id, req.params.peerId, q, { limit });
	const body = await searchService.exportSearchHitsAsNdjson(rows);
	res.setHeader("Content-Type", "application/x-ndjson");
	res.status(200).send(body);
});
