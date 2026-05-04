import { z } from "zod";
import { MAX_PROFILE_FULLNAME_LENGTH } from "../constants/limits.js";

export const patchProfileBodySchema = z.object({
	fullName: z.string().min(1).max(MAX_PROFILE_FULLNAME_LENGTH),
});
