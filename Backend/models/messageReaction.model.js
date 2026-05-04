import mongoose from "mongoose";

const messageReactionSchema = new mongoose.Schema(
	{
		messageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			required: true,
			index: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		symbol: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 32,
		},
	},
	{ timestamps: true },
);

messageReactionSchema.index({ messageId: 1, userId: 1, symbol: 1 }, { unique: true });
messageReactionSchema.index({ messageId: 1, createdAt: 1 });

messageReactionSchema.statics.listForMessage = function listForMessage(messageId) {
	return this.find({ messageId }).sort({ createdAt: 1 }).populate("userId", "username fullName profilePic").lean();
};

messageReactionSchema.statics.aggregateCounts = function aggregateCounts(messageId) {
	return this.aggregate([
		{ $match: { messageId: new mongoose.Types.ObjectId(String(messageId)) } },
		{ $group: { _id: "$symbol", userIds: { $push: "$userId" }, count: { $sum: 1 } } },
		{ $sort: { count: -1, _id: 1 } },
	]);
};

messageReactionSchema.statics.removeOne = function removeOne(messageId, userId, symbol) {
	return this.deleteOne({ messageId, userId, symbol });
};

messageReactionSchema.statics.addOne = async function addOne(messageId, userId, symbol) {
	try {
		return await this.create({ messageId, userId, symbol });
	} catch (e) {
		if (e && e.code === 11000) {
			const err = new Error("DUPLICATE_REACTION");
			err.code = "DUPLICATE_REACTION";
			throw err;
		}
		throw e;
	}
};

messageReactionSchema.statics.countForUserOnMessage = function countForUserOnMessage(messageId, userId) {
	return this.countDocuments({ messageId, userId });
};

messageReactionSchema.statics.listForMessagesBulk = function listForMessagesBulk(messageIds) {
	return this.find({ messageId: { $in: messageIds } })
		.populate("userId", "username profilePic")
		.sort({ createdAt: 1 })
		.lean();
};

messageReactionSchema.statics.deleteAllForMessage = function deleteAllForMessage(messageId) {
	return this.deleteMany({ messageId });
};

messageReactionSchema.statics.topSymbolsForPeerThread = async function topSymbolsForPeerThread(
	participantA,
	participantB,
	limitMessages,
) {
	const Message = mongoose.model("Message");
	const ids = await Message.find({
		$or: [
			{ senderId: participantA, receiverId: participantB },
			{ senderId: participantB, receiverId: participantA },
		],
	})
		.sort({ createdAt: -1 })
		.limit(limitMessages)
		.select("_id")
		.lean();
	const messageIds = ids.map((x) => x._id);
	if (!messageIds.length) return [];
	return this.aggregate([
		{ $match: { messageId: { $in: messageIds } } },
		{ $group: { _id: "$symbol", count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $limit: 20 },
	]);
};

messageReactionSchema.statics.replaceSymbolForUser = async function replaceSymbolForUser(messageId, userId, nextSymbol) {
	await this.deleteMany({ messageId, userId });
	return this.create({ messageId, userId, symbol: nextSymbol });
};

const MessageReaction = mongoose.model("MessageReaction", messageReactionSchema);

export default MessageReaction;
