import mongoose from "mongoose";
import dotenv from "dotenv";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import UserPreferences from "../models/userPreferences.model.js";
import BlockEntry from "../models/blockEntry.model.js";
import Report from "../models/report.model.js";
import MessageReaction from "../models/messageReaction.model.js";
import PinnedMessage from "../models/pinnedMessage.model.js";
import MessageDraft from "../models/messageDraft.model.js";
import MessageAttachment from "../models/messageAttachment.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_DB_URI;

async function run() {
	if (!MONGO_URI) {
		console.error("Set MONGO_URI or MONGO_DB_URI in .env");
		process.exit(1);
	}

	await mongoose.connect(MONGO_URI);

	await User.collection.createIndex({ username: 1 }, { unique: true });
	await User.collection.createIndex({ email: 1 }, { unique: true });
	await Conversation.collection.createIndex({ participants: 1 });
	await Message.collection.createIndex({ senderId: 1, receiverId: 1, createdAt: -1 });
	await UserPreferences.collection.createIndex({ user: 1 }, { unique: true });
	await BlockEntry.collection.createIndex({ blockerId: 1, blockedId: 1 }, { unique: true });
	await Report.collection.createIndex({ reporterId: 1, createdAt: -1 });
	await Report.collection.createIndex({ targetUserId: 1, status: 1 });
	await MessageReaction.collection.createIndex({ messageId: 1, userId: 1, symbol: 1 }, { unique: true });
	await PinnedMessage.collection.createIndex({ ownerId: 1, peerId: 1, messageId: 1 }, { unique: true });
	await MessageDraft.collection.createIndex({ userId: 1, peerId: 1 }, { unique: true });
	await MessageAttachment.collection.createIndex({ messageId: 1, createdAt: 1 });

	console.log("Indexes ensured.");
	await mongoose.disconnect();
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
