import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Contact from "../models/contacts.model.js";
import { HttpError } from "../errors/HttpError.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function signupUser(body, res) {
	const { fullName, username, email, password, gender } = body;

	const existingUsername = await User.findOne({ username: new RegExp(`^${escapeRegex(username)}$`, "i") });
	if (existingUsername) {
		throw new HttpError(400, "Username already exists.");
	}

	const existingEmail = await User.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, "i") });
	if (existingEmail) {
		throw new HttpError(400, "Email is already registered.");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
	const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

	const newUser = new User({
		fullName,
		username,
		email,
		password: hashedPassword,
		gender,
		profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
	});

	await newUser.save();

	const newContactList = new Contact({ user: newUser._id, contacts: [] });
	await newContactList.save();

	generateTokenAndSetCookie(newUser._id, res);

	return {
		_id: newUser._id,
		fullName: newUser.fullName,
		username: newUser.username,
		profilePic: newUser.profilePic,
	};
}

export async function loginUser(body, res) {
	const { username, password } = body;
	const user = await User.findOne({ username: new RegExp(`^${escapeRegex(username)}$`, "i") });
	const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

	if (!user || !isPasswordCorrect) {
		throw new HttpError(400, "Incorrect username or password.");
	}

	let contactList = await Contact.findOne({ user: user._id });
	if (!contactList) {
		contactList = new Contact({ user: user._id, contacts: [] });
		await contactList.save();
	}

	generateTokenAndSetCookie(user._id, res);

	return {
		_id: user._id,
		fullName: user.fullName,
		username: user.username,
		profilePic: user.profilePic,
	};
}
