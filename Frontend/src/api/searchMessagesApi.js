import { API_SEARCH_MESSAGES } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

function qstr(params) {
	const q = new URLSearchParams();
	Object.entries(params || {}).forEach(([k, v]) => {
		if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
	});
	const s = q.toString();
	return s ? `?${s}` : "";
}

export async function fetchGlobalSearch(q, limit) {
	const res = await apiFetch(`${API_SEARCH_MESSAGES}/global${qstr({ q, limit })}`);
	return parseJsonResponse(res);
}

export async function fetchOutboxSearch(q, limit) {
	const res = await apiFetch(`${API_SEARCH_MESSAGES}/outbox${qstr({ q, limit })}`);
	return parseJsonResponse(res);
}

export async function fetchInboxSearch(q, limit) {
	const res = await apiFetch(`${API_SEARCH_MESSAGES}/inbox${qstr({ q, limit })}`);
	return parseJsonResponse(res);
}

export async function fetchThreadSearch(peerId, q, limit, before) {
	const res = await apiFetch(
		`${API_SEARCH_MESSAGES}/thread/${encodeURIComponent(peerId)}${qstr({ q, limit, before })}`,
	);
	return parseJsonResponse(res);
}

export async function fetchThreadSearchCount(peerId, q) {
	const res = await apiFetch(
		`${API_SEARCH_MESSAGES}/thread/${encodeURIComponent(peerId)}/count${qstr({ q })}`,
	);
	return parseJsonResponse(res);
}

export async function fetchPopularTerms(peerId, sample) {
	const res = await apiFetch(
		`${API_SEARCH_MESSAGES}/thread/${encodeURIComponent(peerId)}/terms${qstr({ sample })}`,
	);
	return parseJsonResponse(res);
}

export async function fetchRecentMessageIds(peerId, limit) {
	const res = await apiFetch(
		`${API_SEARCH_MESSAGES}/thread/${encodeURIComponent(peerId)}/recent-ids${qstr({ limit })}`,
	);
	return parseJsonResponse(res);
}

export async function postExactPhraseSearch(peerId, phrase) {
	const res = await apiFetch(`${API_SEARCH_MESSAGES}/thread/${encodeURIComponent(peerId)}/exact`, {
		method: "POST",
		body: { phrase },
	});
	return parseJsonResponse(res);
}

export async function fetchSearchNdjsonExport(peerId, q, limit) {
	const res = await apiFetch(
		`${API_SEARCH_MESSAGES}/thread/${encodeURIComponent(peerId)}/export.ndjson${qstr({ q, limit })}`,
	);
	const text = await res.text();
	return { ok: res.ok, status: res.status, text };
}
