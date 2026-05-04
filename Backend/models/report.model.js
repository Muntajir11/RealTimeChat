import mongoose from "mongoose";

const REPORT_STATUS = ["open", "reviewing", "closed", "dismissed"];
const REPORT_REASON = ["spam", "harassment", "hate", "impersonation", "explicit", "other"];

const reportSchema = new mongoose.Schema(
	{
		reporterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		targetUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		relatedMessageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			default: null,
		},
		reasonCode: {
			type: String,
			required: true,
			enum: REPORT_REASON,
		},
		details: {
			type: String,
			default: "",
			maxlength: 4000,
		},
		status: {
			type: String,
			enum: REPORT_STATUS,
			default: "open",
			index: true,
		},
		lastStatusAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

reportSchema.index({ reporterId: 1, targetUserId: 1, createdAt: -1 });
reportSchema.index({ status: 1, createdAt: -1 });

reportSchema.statics.listForReporter = function listForReporter(reporterId, { limit = 50, skip = 0 } = {}) {
	return this.find({ reporterId })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.populate("targetUserId", "username fullName profilePic")
		.lean();
};

reportSchema.statics.listOpenByTarget = function listOpenByTarget(targetUserId, { limit = 100 } = {}) {
	return this.find({ targetUserId, status: { $in: ["open", "reviewing"] } })
		.sort({ createdAt: -1 })
		.limit(limit)
		.populate("reporterId", "username fullName")
		.lean();
};

reportSchema.statics.countOpenGlobally = function countOpenGlobally() {
	return this.countDocuments({ status: "open" });
};

reportSchema.statics.transitionStatus = async function transitionStatus(reportId, nextStatus) {
	const allowed = new Set(REPORT_STATUS);
	if (!allowed.has(nextStatus)) {
		const err = new Error("INVALID_STATUS");
		err.code = "INVALID_STATUS";
		throw err;
	}
	const doc = await this.findByIdAndUpdate(
		reportId,
		{ status: nextStatus, lastStatusAt: new Date() },
		{ new: true },
	);
	return doc;
};

reportSchema.statics.findDuplicateWindow = async function findDuplicateWindow(reporterId, targetUserId, windowMs) {
	const since = new Date(Date.now() - windowMs);
	return this.findOne({
		reporterId,
		targetUserId,
		createdAt: { $gte: since },
	}).lean();
};

reportSchema.statics.aggregateByReason = function aggregateByReason() {
	return this.aggregate([
		{ $match: { status: { $in: ["open", "reviewing"] } } },
		{ $group: { _id: "$reasonCode", count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
	]);
};

reportSchema.statics.listRecentForPeerPair = function listRecentForPeerPair(userA, userB, limit = 20) {
	return this.find({
		$or: [
			{ reporterId: userA, targetUserId: userB },
			{ reporterId: userB, targetUserId: userA },
		],
	})
		.sort({ createdAt: -1 })
		.limit(limit)
		.lean();
};

export const REPORT_REASON_CODES = REPORT_REASON;
export const REPORT_STATUS_VALUES = REPORT_STATUS;
export default mongoose.model("Report", reportSchema);
