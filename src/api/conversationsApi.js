import { API_CONVERSATIONS } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchConversations() {
	const res = await apiFetch(API_CONVERSATIONS);
	return parseJsonResponse(res);
}
