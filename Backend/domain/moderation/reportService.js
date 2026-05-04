import mongoose from "mongoose";
import Report, { REPORT_REASON_CODES } from "../../models/report.model.js";
import Message from "../../models/message.model.js";
import { HttpError } from "../../errors/HttpError.js";
import { assertReportTargetAllowed } from "../blocking/blockPolicy.js";

const DUPLICATE_WINDOW_MS = 6 * 60 * 60 * 1000;

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

export function listReportReasonCodes() {
	return [...REPORT_REASON_CODES];
}

export async function createReport(reporterId, payload) {
	const { targetUserId, reasonCode, details, relatedMessageId } = payload;
	await assertReportTargetAllowed(reporterId, targetUserId);
	if (!REPORT_REASON_CODES.includes(reasonCode)) {
		throw new HttpError(400, "Invalid reason code");
	}
	const dup = await Report.findDuplicateWindow(reporterId, targetUserId, DUPLICATE_WINDOW_MS);
	if (dup) {
		throw new HttpError(429, "You already submitted a recent report for this user");
	}
	if (relatedMessageId) {
		const mid = toOid(relatedMessageId);
		if (!mid) throw new HttpError(400, "Invalid message id");
		const msg = await Message.findById(mid).select("senderId receiverId").lean();
		if (!msg) throw new HttpError(404, "Related message not found");
		const rs = String(msg.senderId);
		const rr = String(msg.receiverId);
		const rt = String(targetUserId);
		const rp = String(reporterId);
		const touches = [rs, rr].includes(rt) && [rs, rr].includes(rp);
		if (!touches) {
			throw new HttpError(400, "Message does not belong to this reporter and target pair");
		}
	}
	const doc = await Report.create({
		reporterId,
		targetUserId,
		reasonCode,
		details: details || "",
		relatedMessageId: relatedMessageId || null,
		status: "open",
	});
	return doc.toObject();
}

export async function listMyReports(reporterId, query) {
	const limit = Math.min(Math.max(Number(query.limit) || 40, 1), 200);
	const skip = Math.max(Number(query.skip) || 0, 0);
	return Report.listForReporter(reporterId, { limit, skip });
}

export async function getReportByIdForReporter(reportId, reporterId) {
	const rid = toOid(reportId);
	if (!rid) throw new HttpError(400, "Invalid report id");
	const row = await Report.findOne({ _id: rid, reporterId }).populate("targetUserId", "username fullName profilePic").lean();
	if (!row) throw new HttpError(404, "Report not found");
	return row;
}

export async function reopenReportIfOwned(reportId, reporterId) {
	const rid = toOid(reportId);
	if (!rid) throw new HttpError(400, "Invalid report id");
	const doc = await Report.findOne({ _id: rid, reporterId });
	if (!doc) throw new HttpError(404, "Report not found");
	if (doc.status === "closed" || doc.status === "dismissed") {
		doc.status = "open";
		doc.lastStatusAt = new Date();
		await doc.save();
	}
	return doc.toObject();
}

export async function summarizeOpenReports() {
	const [count, byReason] = await Promise.all([Report.countOpenGlobally(), Report.aggregateByReason()]);
	return { openCount: count, byReason };
}

export async function listOpenReportsAgainstUser(targetUserId, limit) {
	return Report.listOpenByTarget(targetUserId, { limit });
}

export async function listPeerReportHistory(userA, userB, limit) {
	return Report.listRecentForPeerPair(userA, userB, limit);
}

export async function transitionReportStatus(reportId, nextStatus, actorUserId) {
	const rid = toOid(reportId);
	if (!rid) throw new HttpError(400, "Invalid report id");
	const doc = await Report.findById(rid);
	if (!doc) throw new HttpError(404, "Report not found");
	if (String(doc.reporterId) !== String(actorUserId)) {
		throw new HttpError(403, "You cannot change this report");
	}
	if (nextStatus === "open" && doc.status === "open") {
		return doc.toObject();
	}
	const updated = await Report.transitionStatus(rid, nextStatus);
	return updated ? updated.toObject() : null;
}

export async function attachMessageEvidence(reportId, reporterId, messageId) {
	const rid = toOid(reportId);
	const mid = toOid(messageId);
	if (!rid || !mid) throw new HttpError(400, "Invalid id");
	const rep = await Report.findOne({ _id: rid, reporterId });
	if (!rep) throw new HttpError(404, "Report not found");
	const msg = await Message.findById(mid).select("senderId receiverId").lean();
	if (!msg) throw new HttpError(404, "Message not found");
	const rt = String(rep.targetUserId);
	const rr = String(rep.reporterId);
	const ok =
		(String(msg.senderId) === rt && String(msg.receiverId) === rr) ||
		(String(msg.receiverId) === rt && String(msg.senderId) === rr);
	if (!ok) {
		throw new HttpError(400, "Message does not involve reporter and target");
	}
	rep.relatedMessageId = mid;
	await rep.save();
	return rep.toObject();
}

export async function deleteDraftReport(reportId, reporterId) {
	const rid = toOid(reportId);
	if (!rid) throw new HttpError(400, "Invalid report id");
	const res = await Report.deleteOne({ _id: rid, reporterId, status: "open" });
	if (!res.deletedCount) {
		throw new HttpError(404, "Report not found or not deletable");
	}
	return { ok: true };
}

export async function countReportsForTarget(targetUserId, since) {
	return Report.countDocuments({ targetUserId, createdAt: { $gte: since } });
}

export async function bulkExportReportsJsonLines(reporterId, limit) {
	const rows = await Report.find({ reporterId })
		.sort({ createdAt: -1 })
		.limit(limit)
		.populate("targetUserId", "username")
		.lean();
	return rows.map((r) => JSON.stringify({ id: String(r._id), reason: r.reasonCode, status: r.status, at: r.createdAt }));
}
