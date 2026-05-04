import { z } from "zod";

export const addContactBodySchema = z.object({
	username: z.string().min(1),
});
