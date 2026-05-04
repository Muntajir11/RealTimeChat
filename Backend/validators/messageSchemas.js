import { z } from "zod";
import { MAX_MESSAGE_LENGTH } from "../constants/limits.js";

export const sendMessageBodySchema = z.object({
	message: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});