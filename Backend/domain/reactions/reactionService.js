import mongoose from "mongoose";
import MessageReaction from "../../models/messageReaction.model.js";
import Message from "../../models/message.model.js";
import { HttpError } from "../../errors/HttpError.js";
import { assertReactionPeerAllowed } from "../blocking/blockPolicy.js";

const ALLOWED_SYMBOLS = new Set([
	"👍",
	"👎",
	"❤️",
	"😂",
	"😮",
	"😢",
	"🙏",
	"🔥",
	"✅",
	"⭐",
]);

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

export function listAllowedReactionSymbols() {
	return Array.from(ALLOWED_SYMBOLS);
}

export async function addReaction(userId, messageId, symbol) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	if (!ALLOWED_SYMBOLS.has(symbol)) {
		throw new HttpError(400, "Unsupported reaction symbol");
	}
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	try {
		const doc = await MessageReaction.addOne(mid, userId, symbol);
		return doc.toObject();
	} catch (e) {
		if (e && e.code === "DUPLICATE_REACTION") {
			const updated = await MessageReaction.replaceSymbolForUser(mid, userId, symbol);
			return updated.toObject();
		}
		throw e;
	}
}

export async function removeReaction(userId, messageId, symbol) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	const res = await MessageReaction.removeOne(mid, userId, symbol);
	if (!res.deletedCount) {
		throw new HttpError(404, "Reaction not found");
	}
	return { ok: true };
}

export async function listReactionsForMessage(userId, messageId) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	const [rows, counts] = await Promise.all([
		MessageReaction.listForMessage(mid),
		MessageReaction.aggregateCounts(mid),
	]);
	return { items: rows, counts };
}

export async function listReactionsBulkForMessages(userId, messageIds) {
	const ids = messageIds.map((x) => toOid(x)).filter(Boolean);
	if (!ids.length) return [];
	const msgs = await Message.find({ _id: { $in: ids } }).select("senderId receiverId").lean();
	const uid = String(userId);
	for (const m of msgs) {
		if (String(m.senderId) !== uid && String(m.receiverId) !== uid) {
			throw new HttpError(403, "Cannot access one of the messages");
		}
	}
	return MessageReaction.listForMessagesBulk(ids);
}

export async function clearAllReactionsOnMessage(userId, messageId) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	const n = await MessageReaction.countForUserOnMessage(mid, userId);
	if (n === 0) {
		return { removed: 0 };
	}
	await MessageReaction.deleteMany({ messageId: mid, userId });
	return { removed: n };
}

export async function summarizeThreadReactions(participantA, participantB, sampleSize) {
	const size = Math.min(Math.max(Number(sampleSize) || 200, 10), 2000);
	return MessageReaction.topSymbolsForPeerThread(participantA, participantB, size);
}

export async function countReactionsOnMessage(messageId) {
	const mid = toOid(messageId);
	if (!mid) return 0;
	const rows = await MessageReaction.aggregateCounts(mid);
	return rows.reduce((acc, r) => acc + r.count, 0);
}

export async function listMyReactionsOnMessage(userId, messageId) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const msg = await Message.findById(mid).lean();
	await assertReactionPeerAllowed(userId, msg);
	return MessageReaction.find({ messageId: mid, userId }).sort({ createdAt: -1 }).lean();
}

export async function pruneReactionsForDeletedMessage(messageId) {
	const mid = toOid(messageId);
	if (!mid) return { removed: 0 };
	const res = await MessageReaction.deleteAllForMessage(mid);
	return { removed: res.deletedCount ?? 0 };
}

export async function assertMessageExists(messageId) {
	const mid = toOid(messageId);
	if (!mid) throw new HttpError(400, "Invalid message id");
	const exists = await Message.exists({ _id: mid });
	if (!exists) throw new HttpError(404, "Message not found");
	return mid;
}

export async function mergeReactionUserRecords(oldUserId, newUserId) {
	const oid = new mongoose.Types.ObjectId(String(oldUserId));
	const nid = new mongoose.Types.ObjectId(String(newUserId));
	const res = await MessageReaction.updateMany({ userId: oid }, { $set: { userId: nid } });
	return { modified: res.modifiedCount };
}
