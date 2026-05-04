import { API_BLOCKS } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchBlockTotals() {
	const res = await apiFetch(`${API_BLOCKS}/totals`);
	return parseJsonResponse(res);
}

export async function fetchBlockedList(page, pageSize) {
	const q = new URLSearchParams();
	if (page != null) q.set("page", String(page));
	if (pageSize != null) q.set("pageSize", String(pageSize));
	const res = await apiFetch(`${API_BLOCKS}/list?${q.toString()}`);
	return parseJsonResponse(res);
}

export async function fetchBlockStats() {
	const res = await apiFetch(`${API_BLOCKS}/stats`);
	return parseJsonResponse(res);
}

export async function fetchBlockSummary(userId) {
	const res = await apiFetch(`${API_BLOCKS}/summary/${encodeURIComponent(userId)}`);
	return parseJsonResponse(res);
}

export async function fetchBlockCountBetween(userId) {
	const res = await apiFetch(`${API_BLOCKS}/count/${encodeURIComponent(userId)}`);
	return parseJsonResponse(res);
}

export async function fetchRecentBlocksBetween(userId, windowMs) {
	const q = windowMs != null ? `?windowMs=${encodeURIComponent(String(windowMs))}` : "";
	const res = await apiFetch(`${API_BLOCKS}/recent/${encodeURIComponent(userId)}${q}`);
	return parseJsonResponse(res);
}

export async function fetchBlockRecord(blockedId) {
	const res = await apiFetch(`${API_BLOCKS}/record/${encodeURIComponent(blockedId)}`);
	return parseJsonResponse(res);
}

export async function postBlockUser(blockedId, reason) {
	const res = await apiFetch(API_BLOCKS, {
		method: "POST",
		body: { blockedId, reason },
	});
	return parseJsonResponse(res);
}

export async function deleteBlockUser(blockedId) {
	const res = await apiFetch(`${API_BLOCKS}/${encodeURIComponent(blockedId)}`, {
		method: "DELETE",
	});
	return parseJsonResponse(res);
}

export async function postBulkBlockPreview(usernames) {
	const res = await apiFetch(`${API_BLOCKS}/bulk-preview`, {
		method: "POST",
		body: { usernames },
	});
	return parseJsonResponse(res);
}

export async function postPruneOrphanBlocks() {
	const res = await apiFetch(`${API_BLOCKS}/maintenance/prune-orphans`, {
		method: "POST",
		body: {},
	});
	return parseJsonResponse(res);
}

export async function fetchBlockExportCsv() {
	const res = await apiFetch(`${API_BLOCKS}/export.csv`);
	const text = await res.text();
	return { ok: res.ok, status: res.status, text };
}
