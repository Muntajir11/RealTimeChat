import { API_EXPORT } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

function qstr(params) {
	const q = new URLSearchParams();
	Object.entries(params || {}).forEach(([k, v]) => {
		if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
	});
	const s = q.toString();
	return s ? `?${s}` : "";
}

export async function fetchExportablePeers(limit) {
	const res = await apiFetch(`${API_EXPORT}/peers${qstr({ limit })}`);
	return parseJsonResponse(res);
}

export async function fetchConversationTouchCount() {
	const res = await apiFetch(`${API_EXPORT}/conversations/count`);
	return parseJsonResponse(res);
}

export async function fetchExportJson(peerId, maxMessages) {
	const res = await apiFetch(`${API_EXPORT}/peer/${encodeURIComponent(peerId)}.json${qstr({ maxMessages })}`);
	return parseJsonResponse(res);
}

export async function fetchExportPretty(peerId) {
	const res = await apiFetch(`${API_EXPORT}/peer/${encodeURIComponent(peerId)}.pretty`);
	const text = await res.text();
	return { ok: res.ok, status: res.status, text };
}

export async function fetchExportSummary(peerId) {
	const res = await apiFetch(`${API_EXPORT}/peer/${encodeURIComponent(peerId)}/summary`);
	return parseJsonResponse(res);
}

export async function fetchExportVerify(peerId) {
	const res = await apiFetch(`${API_EXPORT}/peer/${encodeURIComponent(peerId)}/verify`);
	return parseJsonResponse(res);
}

export async function fetchExportCsv(peerId) {
	const res = await apiFetch(`${API_EXPORT}/peer/${encodeURIComponent(peerId)}.csv`);
	const text = await res.text();
	return { ok: res.ok, status: res.status, text };
}
