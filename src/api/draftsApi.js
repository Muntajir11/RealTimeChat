import { API_DRAFTS } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchDraftList(limit) {
	const q = limit != null ? `?limit=${encodeURIComponent(String(limit))}` : "";
	const res = await apiFetch(`${API_DRAFTS}/list${q}`);
	return parseJsonResponse(res);
}

export async function fetchDraftCharTotal() {
	const res = await apiFetch(`${API_DRAFTS}/chars`);
	return parseJsonResponse(res);
}

export async function fetchDraftPeers() {
	const res = await apiFetch(`${API_DRAFTS}/peers`);
	return parseJsonResponse(res);
}

export async function postPurgeDrafts(maxAgeMs) {
	const res = await apiFetch(`${API_DRAFTS}/purge`, {
		method: "POST",
		body: { maxAgeMs },
	});
	return parseJsonResponse(res);
}

export async function postCopyDraft(fromPeerId, toPeerId) {
	const res = await apiFetch(`${API_DRAFTS}/copy`, {
		method: "POST",
		body: { fromPeerId, toPeerId },
	});
	return parseJsonResponse(res);
}

export async function deleteAllDrafts() {
	const res = await apiFetch(`${API_DRAFTS}/all`, { method: "DELETE" });
	return parseJsonResponse(res);
}

export async function fetchDraft(peerId) {
	const res = await apiFetch(`${API_DRAFTS}/${encodeURIComponent(peerId)}`);
	return parseJsonResponse(res);
}

export async function putDraft(peerId, body, clientNonce) {
	const res = await apiFetch(`${API_DRAFTS}/${encodeURIComponent(peerId)}`, {
		method: "PUT",
		body: { body, clientNonce },
	});
	return parseJsonResponse(res);
}

export async function deleteDraft(peerId) {
	const res = await apiFetch(`${API_DRAFTS}/${encodeURIComponent(peerId)}`, {
		method: "DELETE",
	});
	return parseJsonResponse(res);
}

export async function fetchDraftExists(peerId) {
	const res = await apiFetch(`${API_DRAFTS}/${encodeURIComponent(peerId)}/exists`);
	return parseJsonResponse(res);
}

export async function postAppendDraft(peerId, append) {
	const res = await apiFetch(`${API_DRAFTS}/${encodeURIComponent(peerId)}/append`, {
		method: "POST",
		body: { append },
	});
	return parseJsonResponse(res);
}

export async function fetchDraftSnapshot(peerId) {
	const res = await apiFetch(`${API_DRAFTS}/${encodeURIComponent(peerId)}/snapshot`);
	return parseJsonResponse(res);
}
