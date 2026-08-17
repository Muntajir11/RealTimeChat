import { describe, it, expect } from "vitest";
import { loginRequest } from "./authApi.js";

describe("loginRequest", () => {
	it("returns user payload on success", async () => {
		const { ok, data } = await loginRequest({ username: "alice", password: "password12" });
		expect(ok).toBe(true);
		expect(data.username).toBe("alice");
		expect(data._id).toBe("u-alice");
	});

	it("surfaces error body on failure", async () => {
		const { ok, data } = await loginRequest({ username: "bad", password: "x" });
		expect(ok).toBe(false);
		expect(data.error).toBe("Invalid");
	});
});
