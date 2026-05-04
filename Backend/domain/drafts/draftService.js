import mongoose from "mongoose";
import MessageDraft from "../../models/messageDraft.model.js";
import { HttpError } from "../../errors/HttpError.js";
import { assertMessagingAllowed } from "../blocking/blockPolicy.js";

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

export async function saveDraft(userId, peerId, body, clientNonce) {
	const pid = toOid(peerId);
	if (!pid) throw new HttpError(400, "Invalid peer id");
	await assertMessagingAllowed(userId, pid);
	if (typeof body !== "string" || !body.trim()) {
		throw new HttpError(400, "Draft body is required");
	}
	if (body.length > 8000) {
		throw new HttpError(400, "Draft is too long");
	}
	const doc = await MessageDraft.upsertDraft(userId, pid, body, clientNonce);
	return doc;
}

export async function getDraft(userId, peerId) {
	const pid = toOid(peerId);
	if (!pid) throw new HttpError(400, "Invalid peer id");
	await assertMessagingAllowed(userId, pid);
	const row = await MessageDraft.getDraft(userId, pid);
	return row;
}

export async function deleteDraft(userId, peerId) {
	const pid = toOid(peerId);
	if (!pid) throw new HttpError(400, "Invalid peer id");
	const res = await MessageDraft.deleteDraft(userId, pid);
	if (!res.deletedCount) {
		throw new HttpError(404, "Draft not found");
	}
	return { ok: true };
}

export async function listDrafts(userId, limit) {
	const lim = Math.min(Math.max(Number(limit) || 80, 1), 200);
	return MessageDraft.listDraftsForUser(userId, lim);
}

export async function totalDraftCharacters(userId) {
	return MessageDraft.countCharsForUser(userId);
}

export async function purgeStaleDrafts(maxAgeMs) {
	const ms = Math.max(Number(maxAgeMs) || 0, 60 * 1000);
	const cutoff = new Date(Date.now() - ms);
	const res = await MessageDraft.bulkDeleteStale(cutoff);
	return { removed: res.deletedCount ?? 0 };
}

export async function copyDraftBetweenPeers(userId, fromPeerId, toPeerId) {
	const a = toOid(fromPeerId);
	const b = toOid(toPeerId);
	if (!a || !b) throw new HttpError(400, "Invalid peer id");
	await assertMessagingAllowed(userId, a);
	await assertMessagingAllowed(userId, b);
	const doc = await MessageDraft.copyDraftToNewPeer(userId, a, b);
	if (!doc) throw new HttpError(404, "Source draft not found");
	return doc.toObject ? doc.toObject() : doc;
}

export async function listPeersWithDrafts(userId) {
	return MessageDraft.listPeerIdsWithDrafts(userId);
}

export async function existsDraft(userId, peerId) {
	const pid = toOid(peerId);
	if (!pid) return false;
	return MessageDraft.existsDraft(userId, pid);
}

export async function appendToDraft(userId, peerId, append) {
	const pid = toOid(peerId);
	if (!pid) throw new HttpError(400, "Invalid peer id");
	await assertMessagingAllowed(userId, pid);
	const doc = await MessageDraft.mergeBodiesIfSamePeer(userId, pid, String(append || ""));
	return doc.toObject ? doc.toObject() : doc;
}

export async function wipeAllDraftsForUser(userId) {
	const res = await MessageDraft.deleteAllForUser(userId);
	return { removed: res.deletedCount ?? 0 };
}

export async function mergeDraftOwnerRecords(oldUserId, newUserId) {
	const oid = new mongoose.Types.ObjectId(String(oldUserId));
	const nid = new mongoose.Types.ObjectId(String(newUserId));
	const res = await MessageDraft.updateMany({ userId: oid }, { $set: { userId: nid } });
	return { modified: res.modifiedCount };
}

export async function snapshotDraftForExport(userId, peerId) {
	const row = await getDraft(userId, peerId);
	if (!row) return null;
	return {
		peerId: String(peerId),
		updatedAt: row.updatedAt,
		length: row.body.length,
		preview: row.body.slice(0, 200),
	};
}
