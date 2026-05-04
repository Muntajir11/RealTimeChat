import mongoose from "mongoose";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

export async function findConversationByParticipants(a, b) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return null;
	return Conversation.findOne({ participants: { $all: [x, y] } }).lean();
}

export async function listMessageIdsForConversation(conversationId, { skip = 0, limit = 200 } = {}) {
	const cid = toOid(conversationId);
	if (!cid) return [];
	const conv = await Conversation.findById(cid).select("messages").lean();
	if (!conv?.messages?.length) return [];
	const slice = conv.messages.slice(skip, skip + limit);
	return slice.map(String);
}

export async function loadMessagesByIds(ids) {
	const oids = ids.map((i) => toOid(i)).filter(Boolean);
	if (!oids.length) return [];
	return Message.find({ _id: { $in: oids } })
		.sort({ createdAt: 1 })
		.lean();
}

export async function countMessagesBetween(a, b) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return 0;
	return Message.countDocuments({
		$or: [
			{ senderId: x, receiverId: y },
			{ senderId: y, receiverId: x },
		],
	});
}

export async function newestMessageBetween(a, b) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return null;
	return Message.findOne({
		$or: [
			{ senderId: x, receiverId: y },
			{ senderId: y, receiverId: x },
		],
	})
		.sort({ createdAt: -1 })
		.lean();
}

export async function oldestMessageBetween(a, b) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return null;
	return Message.findOne({
		$or: [
			{ senderId: x, receiverId: y },
			{ senderId: y, receiverId: x },
		],
	})
		.sort({ createdAt: 1 })
		.lean();
}

export async function pageMessagesBetween(a, b, { cursor, limit = 50 } = {}) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return [];
	const lim = Math.min(Math.max(Number(limit) || 50, 1), 200);
	const filter = {
		$or: [
			{ senderId: x, receiverId: y },
			{ senderId: y, receiverId: x },
		],
	};
	if (cursor) {
		const c = toOid(cursor);
		if (c) {
			const cur = await Message.findById(c).select("createdAt").lean();
			if (cur?.createdAt) {
				filter.createdAt = { $lt: cur.createdAt };
			}
		}
	}
	return Message.find(filter).sort({ createdAt: -1 }).limit(lim).lean();
}

export async function appendMessageToConversation(conversationId, messageId) {
	const cid = toOid(conversationId);
	const mid = toOid(messageId);
	if (!cid || !mid) return null;
	return Conversation.findByIdAndUpdate(cid, { $push: { messages: mid } }, { new: true }).lean();
}

export async function trimConversationMessageWindow(conversationId, keepLast) {
	const cid = toOid(conversationId);
	if (!cid) return { trimmed: 0 };
	const k = Math.max(Number(keepLast) || 500, 50);
	const conv = await Conversation.findById(cid).select("messages").lean();
	if (!conv?.messages?.length) return { trimmed: 0 };
	const overflow = conv.messages.length - k;
	if (overflow <= 0) return { trimmed: 0 };
	const drop = conv.messages.slice(0, overflow);
	await Conversation.findByIdAndUpdate(cid, { $pullAll: { messages: drop } });
	return { trimmed: drop.length };
}

export async function listConversationsForUser(userId, limit) {
	const uid = toOid(userId);
	if (!uid) return [];
	const lim = Math.min(Math.max(Number(limit) || 40, 1), 200);
	return Conversation.find({ participants: uid })
		.sort({ updatedAt: -1 })
		.limit(lim)
		.select("participants updatedAt createdAt")
		.lean();
}

export async function ensureConversationShell(a, b) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return null;
	let conv = await Conversation.findOne({ participants: { $all: [x, y] } });
	if (!conv) {
		conv = await Conversation.create({ participants: [x, y], messages: [] });
	}
	return conv;
}

export async function deleteConversationRecord(conversationId) {
	const cid = toOid(conversationId);
	if (!cid) return { deleted: false };
	const res = await Conversation.deleteOne({ _id: cid });
	return { deleted: res.deletedCount > 0 };
}

export async function aggregateDailyVolumeBetween(a, b, days) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return [];
	const since = new Date(Date.now() - Number(days || 30) * 86400000);
	return Message.aggregate([
		{
			$match: {
				createdAt: { $gte: since },
				$or: [
					{ senderId: x, receiverId: y },
					{ senderId: y, receiverId: x },
				],
			},
		},
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
				count: { $sum: 1 },
			},
		},
		{ $sort: { _id: 1 } },
	]);
}
