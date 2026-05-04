import mongoose from "mongoose";
import Message from "../../models/message.model.js";
import Conversation from "../../models/conversation.model.js";

function toOid(id) {
	try {
		return new mongoose.Types.ObjectId(String(id));
	} catch {
		return null;
	}
}

export async function averageMessageLengthBetween(a, b) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return 0;
	const agg = await Message.aggregate([
		{
			$match: {
				$or: [
					{ senderId: x, receiverId: y },
					{ senderId: y, receiverId: x },
				],
			},
		},
		{ $group: { _id: null, avgLen: { $avg: { $strLenCP: "$message" } }, count: { $sum: 1 } } },
	]);
	if (!agg[0] || !agg[0].count) return 0;
	return Math.round(agg[0].avgLen * 100) / 100;
}

export async function messagesPerDayBetween(a, b, days) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return [];
	const since = new Date(Date.now() - Number(days || 14) * 86400000);
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

export async function topSendersForUser(viewerId, limit) {
	const v = toOid(viewerId);
	if (!v) return [];
	const lim = Math.min(Math.max(Number(limit) || 10, 1), 50);
	return Message.aggregate([
		{ $match: { receiverId: v } },
		{ $group: { _id: "$senderId", count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{ $limit: lim },
	]);
}

export async function conversationTouchCount(userId) {
	const uid = toOid(userId);
	if (!uid) return 0;
	return Conversation.countDocuments({ participants: uid });
}

export async function longestMessageBetween(a, b) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return null;
	const rows = await Message.aggregate([
		{
			$match: {
				$or: [
					{ senderId: x, receiverId: y },
					{ senderId: y, receiverId: x },
				],
			},
		},
		{ $addFields: { len: { $strLenCP: "$message" } } },
		{ $sort: { len: -1 } },
		{ $limit: 1 },
		{ $project: { _id: 1, len: 1, createdAt: 1, senderId: 1, receiverId: 1 } },
	]);
	return rows[0] || null;
}

export async function hourlyHistogramBetween(a, b) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return [];
	return Message.aggregate([
		{
			$match: {
				$or: [
					{ senderId: x, receiverId: y },
					{ senderId: y, receiverId: x },
				],
			},
		},
		{ $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
		{ $sort: { _id: 1 } },
	]);
}

export async function mediaKeywordHitsBetween(a, b, keyword) {
	const x = toOid(a);
	const y = toOid(b);
	if (!x || !y) return [];
	const rx = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
	return Message.find({
		$or: [
			{ senderId: x, receiverId: y },
			{ senderId: y, receiverId: x },
		],
		message: rx,
	})
		.sort({ createdAt: -1 })
		.limit(50)
		.select("_id createdAt senderId receiverId")
		.lean();
}

export async function streakWithoutReply(viewerId, peerId) {
	const x = toOid(viewerId);
	const y = toOid(peerId);
	if (!x || !y) return 0;
	const rows = await Message.find({
		$or: [
			{ senderId: x, receiverId: y },
			{ senderId: y, receiverId: x },
		],
	})
		.sort({ createdAt: -1 })
		.limit(200)
		.select("senderId")
		.lean();
	let streak = 0;
	for (const row of rows) {
		if (String(row.senderId) === String(x)) streak += 1;
		else break;
	}
	return streak;
}
