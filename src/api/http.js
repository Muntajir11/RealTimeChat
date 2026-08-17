export async function apiFetch(path, { headers = {}, body, ...rest } = {}) {
	const init = {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		...rest,
	};

	if (body !== undefined) {
		init.body =
			typeof body === "string" || body instanceof FormData || body instanceof Blob
				? body
				: JSON.stringify(body);
	}

	return fetch(path, init);
}

export async function parseJsonResponse(res) {
	const data = await res.json().catch(() => ({}));
	return { ok: res.ok, status: res.status, data };
}
