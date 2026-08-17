import { describe, it, expect } from "vitest";
import { extractTime } from "./extractTime.js";

describe("extractTime", () => {
	it("formats hours and minutes with leading zeros", () => {
		const t = extractTime("2020-01-01T08:05:00.000Z");
		expect(t).toMatch(/^\d{2}:\d{2}$/);
	});
});
