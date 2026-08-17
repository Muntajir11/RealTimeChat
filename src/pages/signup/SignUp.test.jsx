import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthContextProvider } from "../../context/AuthContext.jsx";
import SignUp from "./SignUp.jsx";
import toast from "react-hot-toast";

describe("SignUp", () => {
	it("asks for every field before submitting", async () => {
		const user = userEvent.setup();
		const error = vi.spyOn(toast, "error").mockImplementation(() => {});

		render(
			<MemoryRouter>
				<AuthContextProvider>
					<SignUp />
				</AuthContextProvider>
			</MemoryRouter>,
		);

		await user.click(screen.getByRole("button", { name: "Sign Up" }));
		expect(error).toHaveBeenCalledWith("Please fill in all fields");
		error.mockRestore();
	});

	it("rejects mismatched passwords", async () => {
		const user = userEvent.setup();
		const error = vi.spyOn(toast, "error").mockImplementation(() => {});

		render(
			<MemoryRouter>
				<AuthContextProvider>
					<SignUp />
				</AuthContextProvider>
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText("Full Name"), "Maya Rao");
		await user.type(screen.getByLabelText("Username"), "maya");
		await user.type(screen.getByLabelText("Email"), "maya@example.com");
		await user.type(screen.getByLabelText("Password"), "secret12");
		await user.type(screen.getByLabelText("Confirm Password"), "secret99");
		await user.click(screen.getByLabelText("Female"));
		await user.click(screen.getByRole("button", { name: "Sign Up" }));

		expect(error).toHaveBeenCalledWith("Passwords do not match");
		error.mockRestore();
	});
});
