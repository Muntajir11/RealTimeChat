import { API_MESSAGES } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchMessages(peerId) {
	const res = await apiFetch(`${API_MESSAGES}/${peerId}`);
	return parseJsonResponse(res);
}

export async function sendMessageRequest(peerId, message) {
	const res = await apiFetch(`${API_MESSAGES}/send/${peerId}`, {
		method: "POST",
		body: { message },
	});
	return parseJsonResponse(res);
}
