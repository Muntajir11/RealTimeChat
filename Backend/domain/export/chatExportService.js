import mongoose from "mongoose";
import Message from "../../models/message.model.js";
import Conversation from "../../models/conversation.model.js";
import { HttpError } from "../../errors/HttpError.js";
import { assertMessagingAllowed } from "../blocking/blockPolicy.js";

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

export async function buildPeerThreadExport(viewerId, peerId, { maxMessages = 5000 } = {}) {
	const v = toOid(viewerId);
	const p = toOid(peerId);
	if (!v || !p) throw new HttpError(400, "Invalid participant");
	await assertMessagingAllowed(viewerId, p);
	const cap = Math.min(Math.max(Number(maxMessages) || 5000, 10), 20000);
	const msgs = await Message.find({
		$or: [
			{ senderId: v, receiverId: p },
			{ senderId: p, receiverId: v },
		],
	})
		.sort({ createdAt: 1 })
		.limit(cap)
		.lean();
	const messages = msgs.map((m) => ({
		id: String(m._id),
		senderId: String(m.senderId),
		receiverId: String(m.receiverId),
		text: m.message,
		createdAt: m.createdAt,
	}));
	return {
		meta: {
			peerId: String(p),
			count: messages.length,
			exportedAt: new Date().toISOString(),
		},
		messages,
	};
}

export async function streamPeerExportNdjson(res, viewerId, peerId, maxMessages) {
	const bundle = await buildPeerThreadExport(viewerId, peerId, { maxMessages });
	res.setHeader("Content-Type", "application/x-ndjson");
	res.setHeader("Content-Disposition", `attachment; filename="chat-${peerId}.ndjson"`);
	for (const m of bundle.messages) {
		res.write(`${JSON.stringify(m)}\n`);
	}
	res.end();
}

export async function exportJsonAttachment(viewerId, peerId) {
	const bundle = await buildPeerThreadExport(viewerId, peerId, { maxMessages: 5000 });
	return JSON.stringify(bundle, null, 2);
}

export async function summarizeThreadSizes(viewerId, peerId) {
	const v = toOid(viewerId);
	const p = toOid(peerId);
	if (!v || !p) throw new HttpError(400, "Invalid participant");
	await assertMessagingAllowed(viewerId, p);
	const conv = await Conversation.findOne({ participants: { $all: [v, p] } }).select("messages").lean();
	const count = conv?.messages?.length ?? 0;
	const agg = await Message.aggregate([
		{
			$match: {
				$or: [
					{ senderId: v, receiverId: p },
					{ senderId: p, receiverId: v },
				],
			},
		},
		{ $group: { _id: null, chars: { $sum: { $strLenCP: "$message" } }, msgs: { $sum: 1 } } },
	]);
	return { messageCount: agg[0]?.msgs ?? count, charCount: agg[0]?.chars ?? 0 };
}

export async function listExportablePeers(viewerId, limit) {
	const v = toOid(viewerId);
	if (!v) throw new HttpError(400, "Invalid user");
	const lim = Math.min(Math.max(Number(limit) || 50, 1), 200);
	const rows = await Conversation.find({ participants: v })
		.sort({ updatedAt: -1 })
		.limit(lim)
		.select("participants messages updatedAt")
		.lean();
	const out = [];
	for (const row of rows) {
		const other = row.participants.map(String).find((id) => id !== String(v));
		if (!other) continue;
		out.push({ peerId: other, messageCount: row.messages?.length ?? 0, updatedAt: row.updatedAt });
	}
	return out;
}

export async function verifyPeerHasHistory(viewerId, peerId) {
	const v = toOid(viewerId);
	const p = toOid(peerId);
	if (!v || !p) throw new HttpError(400, "Invalid participant");
	const n = await Message.countDocuments({
		$or: [
			{ senderId: v, receiverId: p },
			{ senderId: p, receiverId: v },
		],
	});
	return { count: n };
}

export async function exportCsvSummary(viewerId, peerId) {
	const bundle = await buildPeerThreadExport(viewerId, peerId, { maxMessages: 2000 });
	const lines = ["createdAt,senderId,len"];
	for (const m of bundle.messages) {
		const safe = (s) => `"${String(s).replace(/"/g, '""')}"`;
		lines.push(`${safe(m.createdAt)},${safe(m.senderId)},${String(m.text || "").length}`);
	}
	return lines.join("\n");
}

export async function countConversationsTouchingUser(userId) {
	const uid = toOid(userId);
	if (!uid) throw new HttpError(400, "Invalid user");
	return Conversation.countDocuments({ participants: uid });
}
