import mongoose from "mongoose";

const blockEntrySchema = new mongoose.Schema(
	{
		blockerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		blockedId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		reason: {
			type: String,
			default: "",
			maxlength: 500,
		},
	},
	{ timestamps: true },
);

blockEntrySchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

blockEntrySchema.statics.listBlockedUserIdsForBlocker = async function listBlockedUserIdsForBlocker(blockerId) {
	const rows = await this.find({ blockerId }).select("blockedId").lean();
	return rows.map((r) => String(r.blockedId));
};

blockEntrySchema.statics.listBlockerIdsForBlocked = async function listBlockerIdsForBlocked(blockedId) {
	const rows = await this.find({ blockedId }).select("blockerId").lean();
	return rows.map((r) => String(r.blockerId));
};

blockEntrySchema.statics.existsPair = async function existsPair(blockerId, blockedId) {
	const n = await this.countDocuments({ blockerId, blockedId });
	return n > 0;
};

blockEntrySchema.statics.createBlock = async function createBlock(blockerId, blockedId, reason) {
	if (String(blockerId) === String(blockedId)) {
		const err = new Error("SELF_BLOCK");
		err.code = "SELF_BLOCK";
		throw err;
	}
	const doc = await this.create({ blockerId, blockedId, reason: reason || "" });
	return doc;
};

blockEntrySchema.statics.removeBlock = async function removeBlock(blockerId, blockedId) {
	const res = await this.deleteOne({ blockerId, blockedId });
	return res.deletedCount > 0;
};

blockEntrySchema.statics.listBlockedProfiles = async function listBlockedProfiles(blockerId) {
	return this.find({ blockerId })
		.populate("blockedId", "fullName username profilePic gender")
		.sort({ createdAt: -1 })
		.lean();
};

blockEntrySchema.statics.countIncomingBlocks = async function countIncomingBlocks(userId) {
	return this.countDocuments({ blockedId: userId });
};

blockEntrySchema.statics.countOutgoingBlocks = async function countOutgoingBlocks(userId) {
	return this.countDocuments({ blockerId: userId });
};

blockEntrySchema.statics.findRecentBetween = async function findRecentBetween(aId, bId, since) {
	return this.find({
		$or: [
			{ blockerId: aId, blockedId: bId },
			{ blockerId: bId, blockedId: aId },
		],
		createdAt: { $gte: since },
	})
		.sort({ createdAt: -1 })
		.limit(5)
		.lean();
};

blockEntrySchema.statics.isEitherDirectionBlocked = async function isEitherDirectionBlocked(aId, bId) {
	const n = await this.countDocuments({
		$or: [
			{ blockerId: aId, blockedId: bId },
			{ blockerId: bId, blockedId: aId },
		],
	});
	return n > 0;
};

blockEntrySchema.statics.listBlockedPaginated = function listBlockedPaginated(blockerId, skip, limit) {
	return this.find({ blockerId })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.populate("blockedId", "username fullName profilePic")
		.lean();
};

blockEntrySchema.statics.countBlocksIssuedBy = function countBlocksIssuedBy(blockerId) {
	return this.countDocuments({ blockerId });
};

blockEntrySchema.statics.findBlockDoc = function findBlockDoc(blockerId, blockedId) {
	return this.findOne({ blockerId, blockedId }).lean();
};

const BlockEntry = mongoose.model("BlockEntry", blockEntrySchema);

export default BlockEntry;
