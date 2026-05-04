import { z } from "zod";

export const putPreferencesBodySchema = z.object({
	desktopNotifications: z.boolean().optional(),
	messageSound: z.boolean().optional(),
	showOnlineStatus: z.boolean().optional(),
	enterToSend: z.boolean().optional(),
});
