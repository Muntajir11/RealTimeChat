import mongoose from "mongoose";
import BlockEntry from "../../models/blockEntry.model.js";
import { HttpError } from "../../errors/HttpError.js";
import User from "../../models/user.model.js";
import {
	assertBlockMutationAllowed,
	describeBlockStateBetween,
	listBlockDirectionsForModeration,
} from "./blockPolicy.js";

async function loadUserOrThrow(userId) {
	const u = await User.findById(userId).select("_id username fullName");
	if (!u) throw new HttpError(404, "User not found");
	return u;
}

export async function blockUser(blockerId, blockedId, reason) {
	await assertBlockMutationAllowed(blockerId, blockedId);
	await loadUserOrThrow(blockerId);
	await loadUserOrThrow(blockedId);
	try {
		const doc = await BlockEntry.createBlock(blockerId, blockedId, reason || "");
		return doc.toObject();
	} catch (e) {
		if (e && e.code === 11000) {
			throw new HttpError(409, "User is already blocked");
		}
		if (e && e.code === "SELF_BLOCK") {
			throw new HttpError(400, "You cannot block yourself");
		}
		throw e;
	}
}

export async function unblockUser(blockerId, blockedId) {
	const removed = await BlockEntry.removeBlock(blockerId, blockedId);
	if (!removed) {
		throw new HttpError(404, "Block entry not found");
	}
	return { ok: true };
}

export async function listBlockedUsers(blockerId, { page = 1, pageSize = 25 } = {}) {
	const size = Math.min(Math.max(Number(pageSize) || 25, 1), 100);
	const p = Math.max(Number(page) || 1, 1);
	const skip = (p - 1) * size;
	const [rows, total] = await Promise.all([
		BlockEntry.listBlockedPaginated(blockerId, skip, size),
		BlockEntry.countBlocksIssuedBy(blockerId),
	]);
	return {
		items: rows.map((r) => ({
			blocked: r.blockedId,
			createdAt: r.createdAt,
			reason: r.reason,
		})),
		page: p,
		pageSize: size,
		total,
	};
}

export async function getBlockSummary(blockerId, otherUserId) {
	return describeBlockStateBetween(blockerId, otherUserId);
}

export async function getSelfBlockStats(userId) {
	return listBlockDirectionsForModeration(userId);
}

export async function lookupBlockRecord(blockerId, blockedId) {
	const row = await BlockEntry.findBlockDoc(blockerId, blockedId);
	if (!row) return null;
	return row;
}

export async function bulkResolveTargetsForBlocker(blockerId, rawUsernames) {
	const names = Array.isArray(rawUsernames) ? rawUsernames : [];
	const out = [];
	for (const name of names) {
		if (typeof name !== "string" || !name.trim()) continue;
		const u = await User.findOne({ username: new RegExp(`^${escapeRegex(name)}$`, "i") }).select("_id username");
		if (!u) {
			out.push({ username: name, status: "not_found" });
			continue;
		}
		if (String(u._id) === String(blockerId)) {
			out.push({ username: name, status: "self_skip" });
			continue;
		}
		const exists = await BlockEntry.existsPair(blockerId, u._id);
		out.push({ username: name, userId: u._id, alreadyBlocked: exists });
	}
	return out;
}

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function pruneOrphanBlockReferences() {
	const rows = await BlockEntry.find().select("blockerId blockedId").lean();
	let removed = 0;
	for (const row of rows) {
		const [a, b] = await Promise.all([User.exists({ _id: row.blockerId }), User.exists({ _id: row.blockedId })]);
		if (!a || !b) {
			await BlockEntry.deleteOne({ _id: row._id });
			removed += 1;
		}
	}
	return { removed };
}

export async function exportBlockListCsv(blockerId) {
	const rows = await BlockEntry.find({ blockerId }).populate("blockedId", "username fullName").sort({ createdAt: -1 }).lean();
	const lines = ["username,fullName,blockedAt,reason"];
	for (const r of rows) {
		const u = r.blockedId;
		const un = (u && u.username) || "";
		const fn = (u && u.fullName) || "";
		const safe = (s) => `"${String(s).replace(/"/g, '""')}"`;
		lines.push(`${safe(un)},${safe(fn)},${safe(r.createdAt?.toISOString?.() || "")},${safe(r.reason || "")}`);
	}
	return lines.join("\n");
}

export async function countBlocksBetweenPair(userA, userB) {
	const n = await BlockEntry.countDocuments({
		$or: [
			{ blockerId: userA, blockedId: userB },
			{ blockerId: userB, blockedId: userA },
		],
	});
	return n;
}

export async function listRecentBlockEventsBetween(userA, userB, windowMs) {
	const since = new Date(Date.now() - windowMs);
	return BlockEntry.findRecentBetween(userA, userB, since);
}

export async function assertNotBlockedForOptionalPeer(peerId, viewerId) {
	if (!peerId) return;
	const blocked = await BlockEntry.isEitherDirectionBlocked(peerId, viewerId);
	if (blocked) {
		throw new HttpError(403, "Action denied due to block state");
	}
}

export async function mergeBlockRecordsOnAccountMerge(oldUserId, newUserId) {
	const oid = new mongoose.Types.ObjectId(String(oldUserId));
	const nid = new mongoose.Types.ObjectId(String(newUserId));
	const res1 = await BlockEntry.updateMany({ blockerId: oid }, { $set: { blockerId: nid } });
	const res2 = await BlockEntry.updateMany({ blockedId: oid }, { $set: { blockedId: nid } });
	return { blockerUpdates: res1.modifiedCount, blockedUpdates: res2.modifiedCount };
}
