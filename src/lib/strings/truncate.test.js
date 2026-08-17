import { describe, it, expect } from "vitest";
import { truncate } from "./truncate.js";

describe("truncate", () => {
	it("returns short strings unchanged", () => {
		expect(truncate("hello", 80)).toBe("hello");
	});

	it("clips long strings with an ellipsis", () => {
		expect(truncate("abcdefghij", 6)).toBe("abcde…");
	});

	it("treats non-strings as empty", () => {
		expect(truncate(null)).toBe("");
	});
});
