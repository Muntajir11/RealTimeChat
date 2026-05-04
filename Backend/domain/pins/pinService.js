import mongoose from "mongoose";
import PinnedMessage from "../../models/pinnedMessage.model.js";
import Message from "../../models/message.model.js";
import { HttpError } from "../../errors/HttpError.js";
import { assertPinAllowedForMessage } from "../blocking/blockPolicy.js";

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

export async function pinMessage(ownerId, peerId, messageId, note) {
	const mid = toOid(messageId);
	const pid = toOid(peerId);
	if (!mid || !pid) throw new HttpError(400, "Invalid id");
	const msg = await Message.findById(mid).lean();
	await assertPinAllowedForMessage(ownerId, peerId, msg);
	const existing = await PinnedMessage.findExisting(ownerId, peerId, mid);
	if (existing) {
		throw new HttpError(409, "Message is already pinned for this chat");
	}
	const doc = await PinnedMessage.create({
		ownerId,
		peerId: pid,
		messageId: mid,
		note: typeof note === "string" ? note.slice(0, 500) : "",
	});
	return doc.toObject();
}

export async function unpinMessage(ownerId, peerId, messageId) {
	const mid = toOid(messageId);
	const pid = toOid(peerId);
	if (!mid || !pid) throw new HttpError(400, "Invalid id");
	const removed = await PinnedMessage.removePin(ownerId, pid, mid);
	if (!removed.deletedCount) {
		throw new HttpError(404, "Pin not found");
	}
	return { ok: true };
}

export async function listPins(ownerId, peerId) {
	const pid = toOid(peerId);
	if (!pid) throw new HttpError(400, "Invalid peer id");
	const rows = await PinnedMessage.listForOwnerAndPeer(ownerId, pid);
	return rows.map((r) => ({
		_id: r._id,
		note: r.note,
		createdAt: r.createdAt,
		message: r.messageId,
	}));
}

export async function listAllPinsForOwner(ownerId, page, pageSize) {
	const size = Math.min(Math.max(Number(pageSize) || 30, 1), 100);
	const p = Math.max(Number(page) || 1, 1);
	const skip = (p - 1) * size;
	const rows = await PinnedMessage.listAllForOwnerPaginated(ownerId, skip, size);
	const total = await PinnedMessage.countForOwner(ownerId);
	return { items: rows, page: p, pageSize: size, total };
}

export async function hasPinned(ownerId, peerId, messageId) {
	const mid = toOid(messageId);
	const pid = toOid(peerId);
	if (!mid || !pid) return false;
	return PinnedMessage.existsForMessage(ownerId, pid, mid);
}

export async function prunePinsOlderThan(date) {
	const res = await PinnedMessage.pruneOlderThan(date);
	return { removed: res.deletedCount ?? 0 };
}

export async function replacePinNote(ownerId, peerId, messageId, note) {
	const mid = toOid(messageId);
	const pid = toOid(peerId);
	if (!mid || !pid) throw new HttpError(400, "Invalid id");
	const doc = await PinnedMessage.findOneAndUpdate(
		{ ownerId, peerId: pid, messageId: mid },
		{ $set: { note: String(note || "").slice(0, 500) } },
		{ new: true },
	)
		.lean();
	if (!doc) throw new HttpError(404, "Pin not found");
	return doc;
}

export async function reorderPinsNotSupported(ownerId, peerId) {
	const rows = await PinnedMessage.listForOwnerAndPeer(ownerId, peerId);
	return { count: rows.length, ordered: rows.map((r) => String(r._id)) };
}

export async function countPinsForPeer(ownerId, peerId) {
	const pid = toOid(peerId);
	if (!pid) throw new HttpError(400, "Invalid peer id");
	const rows = await PinnedMessage.listForOwnerAndPeer(ownerId, pid);
	return rows.length;
}

export async function exportPinsAsJson(ownerId, peerId) {
	const rows = await listPins(ownerId, peerId);
	return JSON.stringify(rows, null, 2);
}

export async function validateMessageBelongsToPeerThread(messageId, peerId, viewerId) {
	const mid = toOid(messageId);
	const pid = toOid(peerId);
	if (!mid || !pid) throw new HttpError(400, "Invalid id");
	const msg = await Message.findById(mid).select("senderId receiverId").lean();
	if (!msg) throw new HttpError(404, "Message not found");
	const pv = String(viewerId);
	const pp = String(pid);
	const s = String(msg.senderId);
	const r = String(msg.receiverId);
	const ok = (s === pv || r === pv) && (s === pp || r === pp);
	if (!ok) {
		throw new HttpError(403, "Message is not visible in this thread");
	}
	return msg;
}

export async function mergePinsOnUserMerge(oldUserId, newUserId) {
	return PinnedMessage.reassignPeerOnUserMerge(oldUserId, newUserId);
}
