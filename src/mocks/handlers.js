import { http, HttpResponse } from "msw";
import {
	REPORT_REASONS,
	addBlock,
	addContact,
	blockTotals,
	checkPassword,
	createReport,
	createUser,
	findUserByUsername,
	getPreferences,
	getSessionUser,
	getSidebarUsers,
	listBlocks,
	listReports,
	openSummary,
	patchFullName,
	publicUser,
	putPreferences,
	removeBlock,
	removeReport,
	searchThread,
	sendMessage,
	setSessionUserId,
	threadMessages,
	updateReportStatus,
} from "./store.js";

function json(data, status = 200) {
	return HttpResponse.json(data, { status });
}

function unauthorized() {
	return json({ error: "Unauthorized - No token Provided" }, 401);
}

function requireUser() {
	return getSessionUser();
}

async function readBody(request) {
	try {
		return await request.json();
	} catch {
		return {};
	}
}

export const handlers = [
	http.post("/api/auth/signup", async ({ request }) => {
		const body = await readBody(request);
		const { fullName, username, email, password, confirmPassword, gender } = body;
		if (!fullName || !username || !email || !password || !confirmPassword || !gender) {
			return json({ error: "Please fill in all fields" }, 400);
		}
		if (password !== confirmPassword) {
			return json({ error: "Passwords do not match" }, 400);
		}
		if (findUserByUsername(username)) {
			return json({ error: "Username already exists" }, 400);
		}
		const user = createUser({ fullName, username, email, password, gender });
		setSessionUserId(user._id);
		return json(publicUser(user), 201);
	}),

	http.post("/api/auth/login", async ({ request }) => {
		const body = await readBody(request);
		if (body.username === "bad") {
			return json({ error: "Invalid" }, 400);
		}
		const user = findUserByUsername(body.username);
		if (!user || !checkPassword(user.username, body.password)) {
			return json({ error: "Invalid username or password" }, 400);
		}
		setSessionUserId(user._id);
		return json(publicUser(user), 201);
	}),

	http.post("/api/auth/logout", async () => {
		setSessionUserId(null);
		return json({ message: "Logged out" });
	}),

	http.get("/api/users", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(getSidebarUsers(me._id));
	}),

	http.post("/api/users/add-contact", async ({ request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		const result = addContact(me._id, body.username);
		if (result.error) return json({ error: result.error }, result.status);
		return json(result);
	}),

	http.get("/api/conversations", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(getSidebarUsers(me._id));
	}),

	http.get("/api/messages/:peerId", ({ params }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(threadMessages(me._id, params.peerId));
	}),

	http.post("/api/messages/send/:peerId", async ({ params, request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		if (!body.message) return json({ error: "Message is required" }, 400);
		return json(sendMessage(me._id, params.peerId, body.message));
	}),

	http.get("/api/profile", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(publicUser(me));
	}),

	http.patch("/api/profile", async ({ request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		if (!body.fullName) return json({ error: "fullName is required" }, 400);
		return json(patchFullName(me._id, body.fullName));
	}),

	http.get("/api/preferences", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(getPreferences(me._id));
	}),

	http.put("/api/preferences", async ({ request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		return json(putPreferences(me._id, body));
	}),

	http.get("/api/blocks/totals", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(blockTotals(me._id));
	}),

	http.get("/api/blocks/list", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(listBlocks(me._id));
	}),

	http.get("/api/blocks/stats", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(blockTotals(me._id));
	}),

	http.post("/api/blocks", async ({ request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		const result = addBlock(me._id, body.blockedId, body.reason);
		if (result.error) return json({ error: result.error }, result.status);
		return json(result);
	}),

	http.delete("/api/blocks/:blockedId", ({ params }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		removeBlock(me._id, params.blockedId);
		return json({ ok: true });
	}),

	http.post("/api/blocks/bulk-preview", async ({ request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		const usernames = Array.isArray(body.usernames) ? body.usernames : [];
		return json({
			matched: usernames.map((username) => ({
				username,
				user: publicUser(findUserByUsername(username)),
			})),
		});
	}),

	http.get("/api/reports/reasons", () => json(REPORT_REASONS)),

	http.get("/api/reports/mine", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(listReports(me._id));
	}),

	http.get("/api/reports/open/summary", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(openSummary(me._id));
	}),

	http.post("/api/reports", async ({ request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		return json(createReport(me._id, body), 201);
	}),

	http.patch("/api/reports/:reportId/status", async ({ params, request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		const row = updateReportStatus(params.reportId, body.status);
		if (!row) return json({ error: "Not found" }, 404);
		return json(row);
	}),

	http.delete("/api/reports/:reportId", ({ params }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		removeReport(params.reportId);
		return json({ ok: true });
	}),

	http.get("/api/search/messages/thread/:peerId", ({ params, request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const url = new URL(request.url);
		return json(searchThread(me._id, params.peerId, url.searchParams.get("q")));
	}),

	http.get("/api/search/messages/thread/:peerId/count", ({ params, request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const url = new URL(request.url);
		const hits = searchThread(me._id, params.peerId, url.searchParams.get("q"));
		return json({ count: hits.length });
	}),

	http.get("/api/search/messages/thread/:peerId/terms", () => {
		const me = requireUser();
		if (!me) return unauthorized();
		return json(["filter", "table", "selected"]);
	}),

	http.post("/api/search/messages/thread/:peerId/exact", async ({ params, request }) => {
		const me = requireUser();
		if (!me) return unauthorized();
		const body = await readBody(request);
		return json(searchThread(me._id, params.peerId, body.phrase));
	}),

	http.get("/api/reactions/symbols", () => json(["👍", "❤️", "😂"])),
	http.get("/api/pins/all", () => json({ items: [], total: 0, page: 1, pageSize: 25 })),
	http.get("/api/drafts/list", () => json([])),
	http.get("/api/attachments/recent", () => json([])),
	http.get("/api/export/peers", () => json([])),
];
