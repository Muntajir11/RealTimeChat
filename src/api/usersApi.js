import { API_USERS } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchSidebarUsers() {
	const res = await apiFetch(API_USERS);
	return parseJsonResponse(res);
}

export async function addContactRequest(username) {
	const res = await apiFetch(`${API_USERS}/add-contact`, {
		method: "POST",
		body: { username },
	});
	return parseJsonResponse(res);
}
