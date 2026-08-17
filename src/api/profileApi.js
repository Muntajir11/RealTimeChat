import { API_PROFILE } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function fetchProfile() {
	const res = await apiFetch(API_PROFILE);
	return parseJsonResponse(res);
}

export async function patchProfileFullName(fullName) {
	const res = await apiFetch(API_PROFILE, {
		method: "PATCH",
		body: { fullName },
	});
	return parseJsonResponse(res);
}
