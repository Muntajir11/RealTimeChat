import mongoose from "mongoose";
import dotenv from "dotenv";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import UserPreferences from "../models/userPreferences.model.js";

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

	console.log("Indexes ensured.");
	await mongoose.disconnect();
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
