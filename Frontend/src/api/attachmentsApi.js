import { API_ATTACHMENTS } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

function qstr(params) {
	const q = new URLSearchParams();
	Object.entries(params || {}).forEach(([k, v]) => {
		if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
	});
	const s = q.toString();
	return s ? `?${s}` : "";
}

export async function fetchMyRecentAttachments(limit) {
	const res = await apiFetch(`${API_ATTACHMENTS}/recent${qstr({ limit })}`);
	return parseJsonResponse(res);
}

export async function fetchMyAttachmentStorage() {
	const res = await apiFetch(`${API_ATTACHMENTS}/storage/me`);
	return parseJsonResponse(res);
}

export async function postRegisterAttachment(messageId, payload) {
	const res = await apiFetch(`${API_ATTACHMENTS}/message/${encodeURIComponent(messageId)}`, {
		method: "POST",
		body: payload,
	});
	return parseJsonResponse(res);
}

export async function fetchAttachmentsForMessage(messageId) {
	const res = await apiFetch(`${API_ATTACHMENTS}/message/${encodeURIComponent(messageId)}`);
	return parseJsonResponse(res);
}

export async function putReplaceAttachments(messageId, items) {
	const res = await apiFetch(`${API_ATTACHMENTS}/message/${encodeURIComponent(messageId)}/replace`, {
		method: "PUT",
		body: { items },
	});
	return parseJsonResponse(res);
}

export async function fetchAttachmentSum(messageId) {
	const res = await apiFetch(`${API_ATTACHMENTS}/message/${encodeURIComponent(messageId)}/sum`);
	return parseJsonResponse(res);
}

export async function fetchAttachmentImages(messageId) {
	const res = await apiFetch(`${API_ATTACHMENTS}/message/${encodeURIComponent(messageId)}/images`);
	return parseJsonResponse(res);
}

export async function fetchOversizedAttachments(messageId, maxBytes) {
	const res = await apiFetch(
		`${API_ATTACHMENTS}/message/${encodeURIComponent(messageId)}/oversized${qstr({ maxBytes })}`,
	);
	return parseJsonResponse(res);
}

export async function deleteAllAttachmentsForMessage(messageId) {
	const res = await apiFetch(`${API_ATTACHMENTS}/message/${encodeURIComponent(messageId)}/all`, {
		method: "DELETE",
	});
	return parseJsonResponse(res);
}

export async function deleteAttachment(attachmentId) {
	const res = await apiFetch(`${API_ATTACHMENTS}/${encodeURIComponent(attachmentId)}`, {
		method: "DELETE",
	});
	return parseJsonResponse(res);
}

export async function patchAttachmentMeta(attachmentId, patch) {
	const res = await apiFetch(`${API_ATTACHMENTS}/${encodeURIComponent(attachmentId)}`, {
		method: "PATCH",
		body: patch,
	});
	return parseJsonResponse(res);
}
