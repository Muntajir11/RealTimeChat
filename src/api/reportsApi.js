import { API_REPORTS } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchReportReasons() {
	const res = await apiFetch(`${API_REPORTS}/reasons`);
	return parseJsonResponse(res);
}

export async function fetchMyReports(query) {
	const q = new URLSearchParams(query || {});
	const res = await apiFetch(`${API_REPORTS}/mine?${q.toString()}`);
	return parseJsonResponse(res);
}

export async function fetchOpenSummary() {
	const res = await apiFetch(`${API_REPORTS}/open/summary`);
	return parseJsonResponse(res);
}

export async function fetchOpenAgainstUser(userId, limit) {
	const q = limit != null ? `?limit=${encodeURIComponent(String(limit))}` : "";
	const res = await apiFetch(`${API_REPORTS}/open/against/${encodeURIComponent(userId)}${q}`);
	return parseJsonResponse(res);
}

export async function fetchPeerReportHistory(userId, limit) {
	const q = limit != null ? `?limit=${encodeURIComponent(String(limit))}` : "";
	const res = await apiFetch(`${API_REPORTS}/peer/${encodeURIComponent(userId)}${q}`);
	return parseJsonResponse(res);
}

export async function postCreateReport(payload) {
	const res = await apiFetch(API_REPORTS, {
		method: "POST",
		body: payload,
	});
	return parseJsonResponse(res);
}

export async function postReopenReport(reportId) {
	const res = await apiFetch(`${API_REPORTS}/${encodeURIComponent(reportId)}/reopen`, {
		method: "POST",
		body: {},
	});
	return parseJsonResponse(res);
}

export async function postAttachEvidence(reportId, messageId) {
	const res = await apiFetch(`${API_REPORTS}/${encodeURIComponent(reportId)}/evidence`, {
		method: "POST",
		body: { messageId },
	});
	return parseJsonResponse(res);
}

export async function fetchReport(reportId) {
	const res = await apiFetch(`${API_REPORTS}/${encodeURIComponent(reportId)}`);
	return parseJsonResponse(res);
}

export async function patchReportStatus(reportId, status) {
	const res = await apiFetch(`${API_REPORTS}/${encodeURIComponent(reportId)}/status`, {
		method: "PATCH",
		body: { status },
	});
	return parseJsonResponse(res);
}

export async function deleteReport(reportId) {
	const res = await apiFetch(`${API_REPORTS}/${encodeURIComponent(reportId)}`, {
		method: "DELETE",
	});
	return parseJsonResponse(res);
}

export async function fetchReportsExportNdjson(limit) {
	const q = limit != null ? `?limit=${encodeURIComponent(String(limit))}` : "";
	const res = await apiFetch(`${API_REPORTS}/export.ndjson${q}`);
	const text = await res.text();
	return { ok: res.ok, status: res.status, text };
}

export async function fetchReportCountSince(userId, sinceIso) {
	const q = sinceIso ? `?since=${encodeURIComponent(sinceIso)}` : "";
	const res = await apiFetch(`${API_REPORTS}/count/${encodeURIComponent(userId)}${q}`);
	return parseJsonResponse(res);
}
