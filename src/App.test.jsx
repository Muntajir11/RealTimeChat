import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "./test/renderApp.jsx";

describe("App routing", () => {
	it("sends visitors to login when there is no session", () => {
		renderApp("/");
		expect(screen.getByLabelText("Username")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
	});

	it("keeps signup reachable from login", async () => {
		const user = userEvent.setup();
		renderApp("/login");
		await user.click(screen.getByRole("link", { name: /don't have an account/i }));
		expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
	});
});

describe("login", () => {
	it("opens the inbox after a valid login", async () => {
		const user = userEvent.setup();
		renderApp("/login");

		await user.type(screen.getByLabelText("Username"), "alice");
		await user.type(screen.getByLabelText("Password"), "password12");
		await user.click(screen.getByRole("button", { name: "Login" }));

		await waitFor(() => {
			expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument();
			expect(screen.getByText("Bob Singh")).toBeInTheDocument();
		});
		expect(JSON.parse(localStorage.getItem("chat-user")).username).toBe("alice");
	});

	it("stays on login when credentials are wrong", async () => {
		const user = userEvent.setup();
		renderApp("/login");

		await user.type(screen.getByLabelText("Username"), "alice");
		await user.type(screen.getByLabelText("Password"), "nope");
		await user.click(screen.getByRole("button", { name: "Login" }));

		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
		});
		expect(screen.getByLabelText("Username")).toBeInTheDocument();
		expect(localStorage.getItem("chat-user")).toBeNull();
	});
});
