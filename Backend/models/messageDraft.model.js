import mongoose from "mongoose";

const messageDraftSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		peerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		body: {
			type: String,
			required: true,
			maxlength: 8000,
		},
		clientNonce: {
			type: String,
			default: "",
			maxlength: 128,
		},
	},
	{ timestamps: true },
);

messageDraftSchema.index({ userId: 1, peerId: 1 }, { unique: true });
messageDraftSchema.index({ updatedAt: -1 });

messageDraftSchema.statics.upsertDraft = async function upsertDraft(userId, peerId, body, clientNonce) {
	const filter = { userId, peerId };
	const update = {
		$set: {
			body,
			clientNonce: clientNonce || "",
			updatedAt: new Date(),
		},
		$setOnInsert: { userId, peerId },
	};
	const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
	return this.findOneAndUpdate(filter, update, opts).lean();
};

messageDraftSchema.statics.getDraft = function getDraft(userId, peerId) {
	return this.findOne({ userId, peerId }).lean();
};

messageDraftSchema.statics.deleteDraft = function deleteDraft(userId, peerId) {
	return this.deleteOne({ userId, peerId });
};

messageDraftSchema.statics.listDraftsForUser = function listDraftsForUser(userId, limit = 100) {
	return this.find({ userId })
		.sort({ updatedAt: -1 })
		.limit(limit)
		.populate("peerId", "username fullName profilePic")
		.lean();
};

messageDraftSchema.statics.deleteAllForUser = function deleteAllForUser(userId) {
	return this.deleteMany({ userId });
};

messageDraftSchema.statics.countCharsForUser = async function countCharsForUser(userId) {
	const agg = await this.aggregate([
		{ $match: { userId: new mongoose.Types.ObjectId(String(userId)) } },
		{ $group: { _id: null, total: { $sum: { $strLenCP: "$body" } } } },
	]);
	return agg[0]?.total ?? 0;
};

messageDraftSchema.statics.findStale = function findStale(olderThan) {
	return this.find({ updatedAt: { $lt: olderThan } }).select("_id userId peerId").lean();
};

messageDraftSchema.statics.bulkDeleteStale = function bulkDeleteStale(olderThan) {
	return this.deleteMany({ updatedAt: { $lt: olderThan } });
};

messageDraftSchema.statics.mergeBodiesIfSamePeer = async function mergeBodiesIfSamePeer(userId, peerId, append) {
	const cur = await this.findOne({ userId, peerId });
	if (!cur) {
		return this.create({ userId, peerId, body: append });
	}
	cur.body = `${cur.body}${append}`;
	await cur.save();
	return cur.toObject();
};

messageDraftSchema.statics.listPeerIdsWithDrafts = async function listPeerIdsWithDrafts(userId) {
	const rows = await this.find({ userId }).select("peerId").lean();
	return rows.map((r) => String(r.peerId));
};

messageDraftSchema.statics.existsDraft = async function existsDraft(userId, peerId) {
	const n = await this.countDocuments({ userId, peerId });
	return n > 0;
};

messageDraftSchema.statics.copyDraftToNewPeer = async function copyDraftToNewPeer(userId, fromPeerId, toPeerId) {
	const src = await this.findOne({ userId, peerId: fromPeerId });
	if (!src) return null;
	await this.deleteOne({ userId, peerId: toPeerId });
	return this.create({ userId, peerId: toPeerId, body: src.body, clientNonce: src.clientNonce });
};

const MessageDraft = mongoose.model("MessageDraft", messageDraftSchema);

export default MessageDraft;
