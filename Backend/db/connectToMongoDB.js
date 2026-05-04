import mongoose from "mongoose";
import { getEnv } from "../config/env.js";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(getEnv().MONGO_URI);
		console.log("Successfully Connected to Database");
	} catch (error) {
		console.log("Error connecting db", error.message);
	}
};

export default connectToMongoDB;
