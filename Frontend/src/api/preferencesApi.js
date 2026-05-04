import { API_PREFERENCES } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchPreferences() {
	const res = await apiFetch(API_PREFERENCES);
	return parseJsonResponse(res);
}

export async function putPreferences(payload) {
	const res = await apiFetch(API_PREFERENCES, {
		method: "PUT",
		body: payload,
	});
	return parseJsonResponse(res);
}
