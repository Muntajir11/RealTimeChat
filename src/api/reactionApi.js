import { API_REACTIONS } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchReactionSymbols() {
	const res = await apiFetch(`${API_REACTIONS}/symbols`);
	return parseJsonResponse(res);
}

export async function fetchThreadReactionSummary(peerId, sample) {
	const q = sample != null ? `?sample=${encodeURIComponent(String(sample))}` : "";
	const res = await apiFetch(`${API_REACTIONS}/thread/${encodeURIComponent(peerId)}/summary${q}`);
	return parseJsonResponse(res);
}

export async function postReactionBulk(messageIds) {
	const res = await apiFetch(`${API_REACTIONS}/bulk`, {
		method: "POST",
		body: { messageIds },
	});
	return parseJsonResponse(res);
}

export async function postReaction(messageId, symbol) {
	const res = await apiFetch(`${API_REACTIONS}/${encodeURIComponent(messageId)}`, {
		method: "POST",
		body: { symbol },
	});
	return parseJsonResponse(res);
}

export async function deleteReaction(messageId, symbol) {
	const q = symbol ? `?symbol=${encodeURIComponent(symbol)}` : "";
	const res = await apiFetch(`${API_REACTIONS}/${encodeURIComponent(messageId)}${q}`, {
		method: "DELETE",
	});
	return parseJsonResponse(res);
}

export async function fetchReactions(messageId) {
	const res = await apiFetch(`${API_REACTIONS}/${encodeURIComponent(messageId)}`);
	return parseJsonResponse(res);
}

export async function fetchReactionCount(messageId) {
	const res = await apiFetch(`${API_REACTIONS}/${encodeURIComponent(messageId)}/count`);
	return parseJsonResponse(res);
}

export async function fetchMyReactions(messageId) {
	const res = await apiFetch(`${API_REACTIONS}/${encodeURIComponent(messageId)}/mine`);
	return parseJsonResponse(res);
}

export async function deleteAllMyReactions(messageId) {
	const res = await apiFetch(`${API_REACTIONS}/${encodeURIComponent(messageId)}/all-mine`, {
		method: "DELETE",
	});
	return parseJsonResponse(res);
}
