import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput.jsx";
import toast from "react-hot-toast";

describe("SearchInput", () => {
	it("requires at least three characters before searching", async () => {
		const user = userEvent.setup();
		const error = vi.spyOn(toast, "error").mockImplementation(() => {});

		render(<SearchInput />);
		await user.type(screen.getByPlaceholderText("Search by username…"), "ab");
		await user.click(screen.getByRole("button"));

		expect(error).toHaveBeenCalledWith("Search term must be at least 3 characters long");
		error.mockRestore();
	});
});
