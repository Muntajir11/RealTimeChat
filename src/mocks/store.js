const ALICE_ID = "u-alice";
const BOB_ID = "u-bob";
const RIA_ID = "u-ria";

function avatar(username, gender) {
	const kind = gender === "male" ? "boy" : "girl";
	return `https://avatar.iran.liara.run/public/${kind}?username=${username}`;
}

function clone(value) {
	return JSON.parse(JSON.stringify(value));
}

function seedUsers() {
	return [
		{
			_id: ALICE_ID,
			fullName: "Alice Chen",
			username: "alice",
			email: "alice@example.com",
			gender: "female",
			profilePic: avatar("alice", "female"),
		},
		{
			_id: BOB_ID,
			fullName: "Bob Singh",
			username: "bob",
			email: "bob@example.com",
			gender: "male",
			profilePic: avatar("bob", "male"),
		},
		{
			_id: RIA_ID,
			fullName: "Ria Patel",
			username: "ria",
			email: "ria@example.com",
			gender: "female",
			profilePic: avatar("ria", "female"),
		},
	];
}

function defaultPreferences() {
	return {
		desktopNotifications: true,
		messageSound: true,
		showOnlineStatus: true,
		enterToSend: true,
	};
}

function seedState() {
	const now = "2026-04-02T10:15:00.000Z";
	return {
		users: seedUsers(),
		passwords: {
			alice: "password12",
			bob: "password12",
			ria: "password12",
		},
		sessionUserId: null,
		contacts: {
			[ALICE_ID]: [BOB_ID],
			[BOB_ID]: [ALICE_ID],
			[RIA_ID]: [],
		},
		messages: [
			{
				_id: "m-1",
				senderId: BOB_ID,
				receiverId: ALICE_ID,
				message: "Hey, are you around?",
				createdAt: "2026-04-02T10:12:00.000Z",
			},
			{
				_id: "m-2",
				senderId: ALICE_ID,
				receiverId: BOB_ID,
				message: "Yes — finishing the table filter now.",
				createdAt: now,
			},
		],
		preferences: {
			[ALICE_ID]: defaultPreferences(),
			[BOB_ID]: defaultPreferences(),
			[RIA_ID]: defaultPreferences(),
		},
		blocks: [],
		reports: [],
		nextId: 3,
	};
}

let state = seedState();

export function resetMockStore() {
	state = seedState();
}

export function publicUser(user) {
	if (!user) return null;
	const { _id, fullName, username, email, gender, profilePic } = user;
	return { _id, fullName, username, email, gender, profilePic };
}

export function getSessionUser() {
	if (!state.sessionUserId) return null;
	return state.users.find((u) => u._id === state.sessionUserId) || null;
}

export function setSessionUserId(id) {
	state.sessionUserId = id;
}

export function findUserByUsername(username) {
	return state.users.find((u) => u.username.toLowerCase() === String(username || "").toLowerCase());
}

export function findUserById(id) {
	return state.users.find((u) => u._id === id);
}

export function checkPassword(username, password) {
	return state.passwords[username] === password;
}

export function createUser({ fullName, username, email, password, gender }) {
	const id = `u-${state.nextId++}`;
	const user = {
		_id: id,
		fullName,
		username,
		email,
		gender,
		profilePic: avatar(username, gender),
	};
	state.users.push(user);
	state.passwords[username] = password;
	state.contacts[id] = [];
	state.preferences[id] = defaultPreferences();
	return user;
}

export function getSidebarUsers(userId) {
	const ids = state.contacts[userId] || [];
	return ids.map((id) => publicUser(findUserById(id))).filter(Boolean);
}

export function addContact(userId, username) {
	const peer = findUserByUsername(username);
	if (!peer) return { error: "User not found", status: 404 };
	if (peer._id === userId) return { error: "You cannot add yourself", status: 400 };
	const list = state.contacts[userId] || [];
	if (!list.includes(peer._id)) {
		list.push(peer._id);
		state.contacts[userId] = list;
	}
	const peerList = state.contacts[peer._id] || [];
	if (!peerList.includes(userId)) {
		peerList.push(userId);
		state.contacts[peer._id] = peerList;
	}
	return { message: "Contact added successfully!", user: publicUser(peer) };
}

export function threadMessages(userId, peerId) {
	return state.messages
		.filter(
			(m) =>
				(m.senderId === userId && m.receiverId === peerId) ||
				(m.senderId === peerId && m.receiverId === userId),
		)
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function sendMessage(userId, peerId, message) {
	const row = {
		_id: `m-${state.nextId++}`,
		senderId: userId,
		receiverId: peerId,
		message,
		createdAt: new Date().toISOString(),
	};
	state.messages.push(row);
	return row;
}

export function searchThread(userId, peerId, q) {
	const needle = String(q || "").toLowerCase();
	if (!needle) return [];
	return threadMessages(userId, peerId).filter((m) => m.message.toLowerCase().includes(needle));
}

export function getPreferences(userId) {
	return clone(state.preferences[userId] || defaultPreferences());
}

export function putPreferences(userId, patch) {
	state.preferences[userId] = {
		...getPreferences(userId),
		...patch,
	};
	return getPreferences(userId);
}

export function patchFullName(userId, fullName) {
	const user = findUserById(userId);
	if (!user) return null;
	user.fullName = fullName;
	return publicUser(user);
}

export function listBlocks(userId) {
	const items = state.blocks.filter((b) => b.blockerId === userId);
	return {
		items: items.map((b) => ({
			...b,
			blocked: publicUser(findUserById(b.blockedId)),
		})),
		total: items.length,
		page: 1,
		pageSize: 25,
	};
}

export function blockTotals(userId) {
	return {
		outgoing: state.blocks.filter((b) => b.blockerId === userId).length,
		incoming: state.blocks.filter((b) => b.blockedId === userId).length,
	};
}

export function addBlock(userId, blockedId, reason) {
	if (!findUserById(blockedId)) return { error: "User not found", status: 404 };
	if (state.blocks.some((b) => b.blockerId === userId && b.blockedId === blockedId)) {
		return { error: "Already blocked", status: 400 };
	}
	const entry = {
		_id: `b-${state.nextId++}`,
		blockerId: userId,
		blockedId,
		reason: reason || "",
		createdAt: new Date().toISOString(),
	};
	state.blocks.push(entry);
	return entry;
}

export function removeBlock(userId, blockedId) {
	const before = state.blocks.length;
	state.blocks = state.blocks.filter((b) => !(b.blockerId === userId && b.blockedId === blockedId));
	return before !== state.blocks.length;
}

export const REPORT_REASONS = ["spam", "harassment", "hate", "other"];

export function listReports(userId) {
	return state.reports.filter((r) => r.reporterId === userId);
}

export function createReport(userId, payload) {
	const row = {
		_id: `r-${state.nextId++}`,
		reporterId: userId,
		targetUserId: findUserById(payload.targetUserId) || { _id: payload.targetUserId },
		reasonCode: payload.reasonCode || "other",
		details: payload.details || "",
		status: "open",
		createdAt: new Date().toISOString(),
	};
	state.reports.push(row);
	return row;
}

export function updateReportStatus(reportId, status) {
	const row = state.reports.find((r) => r._id === reportId);
	if (!row) return null;
	row.status = status;
	return row;
}

export function removeReport(reportId) {
	const before = state.reports.length;
	state.reports = state.reports.filter((r) => r._id !== reportId);
	return before !== state.reports.length;
}

export function openSummary(userId) {
	const mine = listReports(userId).filter((r) => r.status === "open");
	const byReason = REPORT_REASONS.map((reasonCode) => ({
		reasonCode,
		count: mine.filter((r) => r.reasonCode === reasonCode).length,
	})).filter((r) => r.count > 0);
	return { openCount: mine.length, byReason };
}

export { ALICE_ID, BOB_ID, RIA_ID };
