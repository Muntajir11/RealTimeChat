import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { loginRequest } from "./authApi.js";

const server = setupServer(
	http.post("/api/auth/login", async ({ request }) => {
		const body = await request.json();
		if (body.username === "bad") {
			return HttpResponse.json({ error: "Invalid" }, { status: 400 });
		}
		return HttpResponse.json({
			_id: "507f1f77bcf86cd799439011",
			fullName: "Test",
			username: body.username,
			profilePic: "",
		});
	}),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("loginRequest", () => {
	it("returns user payload on success", async () => {
		const { ok, data } = await loginRequest({ username: "alice", password: "x" });
		expect(ok).toBe(true);
		expect(data.username).toBe("alice");
	});

	it("surfaces error body on failure", async () => {
		const { ok, data } = await loginRequest({ username: "bad", password: "x" });
		expect(ok).toBe(false);
		expect(data.error).toBe("Invalid");
	});
});
