import { API_AUTH_LOGIN, API_AUTH_LOGOUT, API_AUTH_SIGNUP } from "../constants/routes.js";
import { apiFetch, parseJsonResponse } from "./http.js";

export async function signupRequest(payload) {
	const res = await apiFetch(API_AUTH_SIGNUP, {
		method: "POST",
		body: payload,
	});
	return parseJsonResponse(res);
}

export async function loginRequest(payload) {
	const res = await apiFetch(API_AUTH_LOGIN, {
		method: "POST",
		body: payload,
	});
	return parseJsonResponse(res);
}

export async function logoutRequest() {
	const res = await apiFetch(API_AUTH_LOGOUT, {
		method: "POST",
		body: {},
	});
	return parseJsonResponse(res);
}
