import mongoose from "mongoose";
import BlockEntry from "../../models/blockEntry.model.js";
import { HttpError } from "../../errors/HttpError.js";

function toObjectId(value) {
	try {
		return new mongoose.Types.ObjectId(String(value));
	} catch {
		return null;
	}
}

export async function assertMessagingAllowed(senderId, receiverId) {
	const a = toObjectId(senderId);
	const b = toObjectId(receiverId);
	if (!a || !b) {
		throw new HttpError(400, "Invalid participant");
	}
	if (a.equals(b)) {
		throw new HttpError(400, "Cannot message yourself");
	}
	const blocked = await BlockEntry.isEitherDirectionBlocked(a, b);
	if (blocked) {
		throw new HttpError(403, "Messaging is not allowed between these accounts");
	}
}

export async function assertContactInviteAllowed(actorId, targetUserId) {
	const a = toObjectId(actorId);
	const t = toObjectId(targetUserId);
	if (!a || !t) {
		throw new HttpError(400, "Invalid user");
	}
	if (a.equals(t)) {
		throw new HttpError(400, "You cannot add yourself as a contact");
	}
	const blocked = await BlockEntry.isEitherDirectionBlocked(a, t);
	if (blocked) {
		throw new HttpError(403, "Contact request is not allowed");
	}
}

export async function assertBlockMutationAllowed(blockerId, blockedId) {
	const b = toObjectId(blockerId);
	const x = toObjectId(blockedId);
	if (!b || !x) {
		throw new HttpError(400, "Invalid user");
	}
	if (b.equals(x)) {
		throw new HttpError(400, "You cannot block yourself");
	}
}

export async function assertReportTargetAllowed(reporterId, targetUserId) {
	const r = toObjectId(reporterId);
	const t = toObjectId(targetUserId);
	if (!r || !t) {
		throw new HttpError(400, "Invalid user");
	}
	if (r.equals(t)) {
		throw new HttpError(400, "You cannot report yourself");
	}
}

export async function describeBlockStateBetween(viewerId, otherUserId) {
	const a = toObjectId(viewerId);
	const b = toObjectId(otherUserId);
	if (!a || !b) {
		return { viewerBlockedOther: false, otherBlockedViewer: false, anyBlock: false };
	}
	const [outgoing, incoming] = await Promise.all([
		BlockEntry.existsPair(a, b),
		BlockEntry.existsPair(b, a),
	]);
	return {
		viewerBlockedOther: outgoing,
		otherBlockedViewer: incoming,
		anyBlock: outgoing || incoming,
	};
}

export async function listBlockDirectionsForModeration(userId) {
	const uid = toObjectId(userId);
	if (!uid) return { issued: 0, received: 0 };
	const [issued, received] = await Promise.all([
		BlockEntry.countBlocksIssuedBy(uid),
		BlockEntry.countIncomingBlocks(uid),
	]);
	return { issued, received };
}

export async function filterUserIdsRemovingBlocked(viewerId, candidateIds) {
	const uid = toObjectId(viewerId);
	if (!uid) return [];
	const ids = candidateIds.map((c) => toObjectId(c)).filter(Boolean);
	if (!ids.length) return [];
	const rows = await BlockEntry.find({
		$or: [
			{ blockerId: uid, blockedId: { $in: ids } },
			{ blockedId: uid, blockerId: { $in: ids } },
		],
	})
		.select("blockerId blockedId")
		.lean();
	const blockedPair = new Set();
	for (const row of rows) {
		blockedPair.add(`${row.blockerId}:${row.blockedId}`);
		blockedPair.add(`${row.blockedId}:${row.blockerId}`);
	}
	const out = [];
	for (const id of ids) {
		if (id.equals(uid)) continue;
		const k1 = `${uid}:${id}`;
		const k2 = `${id}:${uid}`;
		if (blockedPair.has(k1) || blockedPair.has(k2)) continue;
		out.push(id);
	}
	return out;
}

export async function assertReactionPeerAllowed(userId, messageDoc) {
	if (!messageDoc) {
		throw new HttpError(404, "Message not found");
	}
	const uid = String(userId);
	const s = String(messageDoc.senderId);
	const r = String(messageDoc.receiverId);
	if (uid !== s && uid !== r) {
		throw new HttpError(403, "You cannot modify reactions on this message");
	}
	const other = uid === s ? messageDoc.receiverId : messageDoc.senderId;
	const blocked = await BlockEntry.isEitherDirectionBlocked(uid, other);
	if (blocked) {
		throw new HttpError(403, "You cannot modify reactions on this thread");
	}
}

export async function assertPinAllowedForMessage(ownerId, peerId, messageDoc) {
	if (!messageDoc) {
		throw new HttpError(404, "Message not found");
	}
	const uid = String(ownerId);
	const p = String(peerId);
	const s = String(messageDoc.senderId);
	const r = String(messageDoc.receiverId);
	const touches = (x, y) => x === y;
	if (!touches(uid, s) && !touches(uid, r)) {
		throw new HttpError(403, "You cannot pin this message");
	}
	if (!touches(p, s) && !touches(p, r)) {
		throw new HttpError(400, "Peer is not part of this message");
	}
	await assertMessagingAllowed(uid, p);
}
