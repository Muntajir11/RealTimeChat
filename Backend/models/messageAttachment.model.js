import mongoose from "mongoose";

const messageAttachmentSchema = new mongoose.Schema(
	{
		messageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			required: true,
			index: true,
		},
		uploadedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		url: {
			type: String,
			required: true,
			maxlength: 2048,
		},
		mimeType: {
			type: String,
			required: true,
			maxlength: 128,
		},
		sizeBytes: {
			type: Number,
			min: 0,
			max: 1073741824,
			default: 0,
		},
		width: { type: Number, min: 0, default: null },
		height: { type: Number, min: 0, default: null },
		durationMs: { type: Number, min: 0, default: null },
		thumbnailUrl: { type: String, default: "", maxlength: 2048 },
		checksumSha256: { type: String, default: "", maxlength: 64 },
	},
	{ timestamps: true },
);

messageAttachmentSchema.index({ messageId: 1, createdAt: 1 });
messageAttachmentSchema.index({ uploadedBy: 1, createdAt: -1 });

messageAttachmentSchema.statics.listForMessage = function listForMessage(messageId) {
	return this.find({ messageId }).sort({ createdAt: 1 }).lean();
};

messageAttachmentSchema.statics.sumSizeForMessage = async function sumSizeForMessage(messageId) {
	const agg = await this.aggregate([
		{ $match: { messageId: new mongoose.Types.ObjectId(String(messageId)) } },
		{ $group: { _id: null, total: { $sum: "$sizeBytes" } } },
	]);
	return agg[0]?.total ?? 0;
};

messageAttachmentSchema.statics.countForUser = function countForUser(uploadedBy) {
	return this.countDocuments({ uploadedBy });
};

messageAttachmentSchema.statics.deleteForMessage = function deleteForMessage(messageId) {
	return this.deleteMany({ messageId });
};

messageAttachmentSchema.statics.listRecentByUser = function listRecentByUser(uploadedBy, limit = 50) {
	return this.find({ uploadedBy })
		.sort({ createdAt: -1 })
		.limit(limit)
		.populate("messageId", "message createdAt senderId receiverId")
		.lean();
};

messageAttachmentSchema.statics.findByChecksumForUser = function findByChecksumForUser(uploadedBy, checksumSha256) {
	if (!checksumSha256) return null;
	return this.findOne({ uploadedBy, checksumSha256 }).lean();
};

messageAttachmentSchema.statics.replaceForMessage = async function replaceForMessage(messageId, uploadedBy, payload) {
	await this.deleteMany({ messageId });
	return this.create({ messageId, uploadedBy, ...payload });
};

messageAttachmentSchema.statics.listImageLikeForMessage = function listImageLikeForMessage(messageId) {
	return this.find({
		messageId,
		mimeType: { $regex: /^image\//i },
	}).lean();
};

messageAttachmentSchema.statics.totalStorageForUser = async function totalStorageForUser(uploadedBy) {
	const agg = await this.aggregate([
		{ $match: { uploadedBy: new mongoose.Types.ObjectId(String(uploadedBy)) } },
		{ $group: { _id: null, total: { $sum: "$sizeBytes" } } },
	]);
	return agg[0]?.total ?? 0;
};

messageAttachmentSchema.statics.findOversizedForMessage = function findOversizedForMessage(messageId, maxBytes) {
	return this.find({ messageId, sizeBytes: { $gt: maxBytes } }).lean();
};

messageAttachmentSchema.statics.patchMeta = async function patchMeta(attachmentId, patch) {
	return this.findByIdAndUpdate(attachmentId, { $set: patch }, { new: true }).lean();
};

const MessageAttachment = mongoose.model("MessageAttachment", messageAttachmentSchema);

export default MessageAttachment;
