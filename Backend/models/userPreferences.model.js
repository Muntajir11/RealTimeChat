import mongoose from "mongoose";

const userPreferencesSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		desktopNotifications: { type: Boolean, default: true },
		messageSound: { type: Boolean, default: true },
		showOnlineStatus: { type: Boolean, default: true },
		enterToSend: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

export default mongoose.model("UserPreferences", userPreferencesSchema);
