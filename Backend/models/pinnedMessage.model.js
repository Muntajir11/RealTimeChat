import mongoose from "mongoose";

function participantKey(a, b) {
	const x = String(a);
	const y = String(b);
	return x < y ? `${x}:${y}` : `${y}:${x}`;
}

const pinnedMessageSchema = new mongoose.Schema(
	{
		ownerId: {
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
		participantKey: {
			type: String,
			required: true,
			index: true,
		},
		messageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			required: true,
		},
		note: {
			type: String,
			default: "",
			maxlength: 500,
		},
	},
	{ timestamps: true },
);

pinnedMessageSchema.index({ ownerId: 1, peerId: 1, messageId: 1 }, { unique: true });
pinnedMessageSchema.index({ participantKey: 1, createdAt: -1 });

pinnedMessageSchema.pre("validate", function preValidate(next) {
	if (this.ownerId && this.peerId) {
		this.participantKey = participantKey(this.ownerId, this.peerId);
	}
	next();
});

pinnedMessageSchema.statics.listForOwnerAndPeer = function listForOwnerAndPeer(ownerId, peerId) {
	const key = participantKey(ownerId, peerId);
	return this.find({ ownerId, peerId, participantKey: key })
		.sort({ createdAt: -1 })
		.populate({
			path: "messageId",
			select: "senderId receiverId message createdAt",
		})
		.limit(50)
		.lean();
};

pinnedMessageSchema.statics.countForOwner = function countForOwner(ownerId) {
	return this.countDocuments({ ownerId });
};

pinnedMessageSchema.statics.removePin = function removePin(ownerId, peerId, messageId) {
	return this.deleteOne({ ownerId, peerId, messageId });
};

pinnedMessageSchema.statics.findExisting = function findExisting(ownerId, peerId, messageId) {
	return this.findOne({ ownerId, peerId, messageId }).lean();
};

pinnedMessageSchema.statics.listAllForOwnerPaginated = function listAllForOwnerPaginated(ownerId, skip, limit) {
	return this.find({ ownerId })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.populate("peerId", "username fullName profilePic")
		.populate({
			path: "messageId",
			select: "message createdAt senderId receiverId",
		})
		.lean();
};

pinnedMessageSchema.statics.pruneOlderThan = function pruneOlderThan(cutoffDate) {
	return this.deleteMany({ createdAt: { $lt: cutoffDate } });
};

pinnedMessageSchema.statics.reassignPeerOnUserMerge = async function reassignPeerOnUserMerge(oldUserId, newUserId) {
	const res1 = await this.updateMany({ ownerId: oldUserId }, { $set: { ownerId: newUserId } });
	const res2 = await this.updateMany({ peerId: oldUserId }, { $set: { peerId: newUserId } });
	return { ownerUpdates: res1.modifiedCount, peerUpdates: res2.modifiedCount };
};

pinnedMessageSchema.statics.listKeysForOwner = async function listKeysForOwner(ownerId) {
	const rows = await this.distinct("participantKey", { ownerId });
	return rows;
};

pinnedMessageSchema.statics.existsForMessage = function existsForMessage(ownerId, peerId, messageId) {
	return this.countDocuments({ ownerId, peerId, messageId }).then((n) => n > 0);
};

const PinnedMessage = mongoose.model("PinnedMessage", pinnedMessageSchema);

export { participantKey };
export default PinnedMessage;
