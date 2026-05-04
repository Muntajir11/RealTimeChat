import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Contact from "../models/contacts.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { SOCKET_EVENT_NEW_MESSAGE } from "../constants/socketEvents.js";
import { MAX_MESSAGE_LENGTH } from "../constants/limits.js";
import { HttpError } from "../errors/HttpError.js";
import { stripControlChars } from "../filters/plainTextMessage.js";

async function ensureContactDoc(userId) {
	let doc = await Contact.findOne({ user: userId });
	if (!doc) {
		doc = await Contact.create({ user: userId, contacts: [] });
	}
	return doc;
}

export async function sendMessageForUser({ senderId, receiverId, text }) {
	const cleaned = stripControlChars(text).trim();
	if (!cleaned) {
		throw new HttpError(400, "Message is empty");
	}
	if (cleaned.length > MAX_MESSAGE_LENGTH) {
		throw new HttpError(400, "Message is too long");
	}

	let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [senderId, receiverId],
		});
	}

	const newMessage = new Message({
		senderId,
		receiverId,
		message: cleaned,
	});

	conversation.messages.push(newMessage._id);
	await Promise.all([conversation.save(), newMessage.save()]);

	const senderContacts = await ensureContactDoc(senderId);
	if (!senderContacts.contacts.includes(receiverId)) {
		senderContacts.contacts.push(receiverId);
		await senderContacts.save();
	}

	const receiverContacts = await ensureContactDoc(receiverId);
	if (!receiverContacts.contacts.includes(senderId)) {
		receiverContacts.contacts.push(senderId);
		await receiverContacts.save();
	}

	const receiverSocketId = getReceiverSocketId(String(receiverId));
	if (receiverSocketId) {
		io.to(receiverSocketId).emit(SOCKET_EVENT_NEW_MESSAGE, newMessage);
	}

	return newMessage;
}

export async function getMessagesForConversation(senderId, userToChatId) {
	const conversation = await Conversation.findOne({
		participants: { $all: [senderId, userToChatId] },
	}).populate("messages");

	if (!conversation) return [];

	return conversation.messages;
}
