import mongoose from "mongoose";
import Message from "../../models/message.model.js";
import { HttpError } from "../../errors/HttpError.js";

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchMessagesForPeerThread(viewerId, peerId, rawQuery, { limit = 40, beforeId } = {}) {
	const v = toOid(viewerId);
	const p = toOid(peerId);
	if (!v || !p) throw new HttpError(400, "Invalid participant");
	const q = typeof rawQuery === "string" ? rawQuery.trim() : "";
	if (q.length < 2) {
		throw new HttpError(400, "Query must be at least 2 characters");
	}
	if (q.length > 200) {
		throw new HttpError(400, "Query is too long");
	}
	const lim = Math.min(Math.max(Number(limit) || 40, 1), 200);
	const filter = {
		$or: [
			{ senderId: v, receiverId: p },
			{ senderId: p, receiverId: v },
		],
		message: { $regex: new RegExp(escapeRegex(q), "i") },
	};
	if (beforeId) {
		const bid = toOid(beforeId);
		if (bid) {
			filter.createdAt = { $lt: (await Message.findById(bid).select("createdAt").lean())?.createdAt };
		}
	}
	const rows = await Message.find(filter).sort({ createdAt: -1 }).limit(lim).lean();
	return rows;
}

export async function searchMyOutbox(viewerId, rawQuery, limit) {
	const v = toOid(viewerId);
	if (!v) throw new HttpError(400, "Invalid user");
	const q = typeof rawQuery === "string" ? rawQuery.trim() : "";
	if (q.length < 2) throw new HttpError(400, "Query must be at least 2 characters");
	const lim = Math.min(Math.max(Number(limit) || 50, 1), 200);
	return Message.find({ senderId: v, message: { $regex: new RegExp(escapeRegex(q), "i") } })
		.sort({ createdAt: -1 })
		.limit(lim)
		.populate("receiverId", "username fullName profilePic")
		.lean();
}

export async function searchMyInbox(viewerId, rawQuery, limit) {
	const v = toOid(viewerId);
	if (!v) throw new HttpError(400, "Invalid user");
	const q = typeof rawQuery === "string" ? rawQuery.trim() : "";
	if (q.length < 2) throw new HttpError(400, "Query must be at least 2 characters");
	const lim = Math.min(Math.max(Number(limit) || 50, 1), 200);
	return Message.find({ receiverId: v, message: { $regex: new RegExp(escapeRegex(q), "i") } })
		.sort({ createdAt: -1 })
		.limit(lim)
		.populate("senderId", "username fullName profilePic")
		.lean();
}

export async function countMatchesForPeer(viewerId, peerId, rawQuery) {
	const v = toOid(viewerId);
	const p = toOid(peerId);
	if (!v || !p) throw new HttpError(400, "Invalid participant");
	const q = typeof rawQuery === "string" ? rawQuery.trim() : "";
	if (q.length < 2) return 0;
	return Message.countDocuments({
		$or: [
			{ senderId: v, receiverId: p },
			{ senderId: p, receiverId: v },
		],
		message: { $regex: new RegExp(escapeRegex(q), "i") },
	});
}

export async function aggregatePopularTerms(viewerId, peerId, sample) {
	const v = toOid(viewerId);
	const p = toOid(peerId);
	if (!v || !p) throw new HttpError(400, "Invalid participant");
	const lim = Math.min(Math.max(Number(sample) || 500, 50), 5000);
	const rows = await Message.find({
		$or: [
			{ senderId: v, receiverId: p },
			{ senderId: p, receiverId: v },
		],
	})
		.sort({ createdAt: -1 })
		.limit(lim)
		.select("message")
		.lean();
	const freq = new Map();
	for (const row of rows) {
		const words = String(row.message || "")
			.toLowerCase()
			.split(/\s+/)
			.filter((w) => w.length > 3);
		for (const w of words) {
			freq.set(w, (freq.get(w) || 0) + 1);
		}
	}
	return Array.from(freq.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 30)
		.map(([word, count]) => ({ word, count }));
}

export async function findMessagesByExactPhrase(viewerId, peerId, phrase) {
	const v = toOid(viewerId);
	const p = toOid(peerId);
	if (!v || !p) throw new HttpError(400, "Invalid participant");
	const ph = typeof phrase === "string" ? phrase.trim() : "";
	if (ph.length < 2) throw new HttpError(400, "Phrase too short");
	return Message.find({
		$or: [
			{ senderId: v, receiverId: p },
			{ senderId: p, receiverId: v },
		],
		message: ph,
	})
		.sort({ createdAt: -1 })
		.limit(100)
		.lean();
}

export async function listRecentIdsForPeer(viewerId, peerId, limit) {
	const v = toOid(viewerId);
	const p = toOid(peerId);
	if (!v || !p) throw new HttpError(400, "Invalid participant");
	const lim = Math.min(Math.max(Number(limit) || 100, 1), 500);
	const rows = await Message.find({
		$or: [
			{ senderId: v, receiverId: p },
			{ senderId: p, receiverId: v },
		],
	})
		.sort({ createdAt: -1 })
		.limit(lim)
		.select("_id createdAt")
		.lean();
	return rows;
}

export async function searchAcrossAllContacts(viewerId, rawQuery, limit) {
	const v = toOid(viewerId);
	if (!v) throw new HttpError(400, "Invalid user");
	const q = typeof rawQuery === "string" ? rawQuery.trim() : "";
	if (q.length < 3) throw new HttpError(400, "Global search requires at least 3 characters");
	const lim = Math.min(Math.max(Number(limit) || 30, 1), 100);
	return Message.find({
		$or: [{ senderId: v }, { receiverId: v }],
		message: { $regex: new RegExp(escapeRegex(q), "i") },
	})
		.sort({ createdAt: -1 })
		.limit(lim)
		.populate("senderId", "username fullName")
		.populate("receiverId", "username fullName")
		.lean();
}

export async function exportSearchHitsAsNdjson(rows) {
	const lines = [];
	for (const r of rows) {
		lines.push(
			JSON.stringify({
				id: String(r._id),
				at: r.createdAt,
				from: String(r.senderId),
				to: String(r.receiverId),
				len: String(r.message || "").length,
			}),
		);
	}
	return lines.join("\n");
}

