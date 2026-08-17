import { API_PINS } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchAllPins(page, pageSize) {
	const q = new URLSearchParams();
	if (page != null) q.set("page", String(page));
	if (pageSize != null) q.set("pageSize", String(pageSize));
	const res = await apiFetch(`${API_PINS}/all?${q.toString()}`);
	return parseJsonResponse(res);
}

export async function fetchPinsForPeer(peerId) {
	const res = await apiFetch(`${API_PINS}/peer/${encodeURIComponent(peerId)}`);
	return parseJsonResponse(res);
}

export async function fetchPinCountForPeer(peerId) {
	const res = await apiFetch(`${API_PINS}/peer/${encodeURIComponent(peerId)}/count`);
	return parseJsonResponse(res);
}

export async function fetchPinsExportJson(peerId) {
	const res = await apiFetch(`${API_PINS}/peer/${encodeURIComponent(peerId)}/export.json`);
	const text = await res.text();
	return { ok: res.ok, status: res.status, text };
}

export async function fetchPinOrder(peerId) {
	const res = await apiFetch(`${API_PINS}/peer/${encodeURIComponent(peerId)}/order`);
	return parseJsonResponse(res);
}

export async function postPinMessage(peerId, messageId, note) {
	const res = await apiFetch(`${API_PINS}/peer/${encodeURIComponent(peerId)}`, {
		method: "POST",
		body: { messageId, note },
	});
	return parseJsonResponse(res);
}

export async function patchPinNote(peerId, messageId, note) {
	const res = await apiFetch(
		`${API_PINS}/peer/${encodeURIComponent(peerId)}/message/${encodeURIComponent(messageId)}/note`,
		{
			method: "PATCH",
			body: { note },
		},
	);
	return parseJsonResponse(res);
}

export async function fetchPinExists(peerId, messageId) {
	const res = await apiFetch(
		`${API_PINS}/peer/${encodeURIComponent(peerId)}/message/${encodeURIComponent(messageId)}`,
	);
	return parseJsonResponse(res);
}

export async function deletePin(peerId, messageId) {
	const res = await apiFetch(
		`${API_PINS}/peer/${encodeURIComponent(peerId)}/message/${encodeURIComponent(messageId)}`,
		{
			method: "DELETE",
		},
	);
	return parseJsonResponse(res);
}
