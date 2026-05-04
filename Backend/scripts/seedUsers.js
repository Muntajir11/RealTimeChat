import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Contact from "../models/contacts.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_DB_URI;

async function run() {
	if (!MONGO_URI) {
		console.error("Set MONGO_URI or MONGO_DB_URI in .env");
		process.exit(1);
	}

	await mongoose.connect(MONGO_URI);

	const salt = await bcrypt.genSalt(10);
	const password = await bcrypt.hash("password123", salt);

	const alice = await User.findOneAndUpdate(
		{ username: "alice" },
		{
			$setOnInsert: {
				fullName: "Alice Demo",
				email: "alice@example.local",
				password,
				gender: "female",
				profilePic: "https://avatar.iran.liara.run/public/girl?username=alice",
			},
		},
		{ upsert: true, new: true },
	);

	const bob = await User.findOneAndUpdate(
		{ username: "bob" },
		{
			$setOnInsert: {
				fullName: "Bob Demo",
				email: "bob@example.local",
				password,
				gender: "male",
				profilePic: "https://avatar.iran.liara.run/public/boy?username=bob",
			},
		},
		{ upsert: true, new: true },
	);

	for (const u of [alice, bob]) {
		await Contact.findOneAndUpdate(
			{ user: u._id },
			{ $setOnInsert: { user: u._id, contacts: [] } },
			{ upsert: true },
		);
	}

	console.log("Seed complete: users alice, bob (password: password123)");
	await mongoose.disconnect();
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
