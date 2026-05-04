import { z } from "zod";

export const signupBodySchema = z
	.object({
		fullName: z.string().min(1),
		username: z.string().min(1),
		email: z.string().email(),
		password: z.string().min(6),
		confirmPassword: z.string().min(6),
		gender: z.enum(["male", "female"]),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "Passwords don't match.",
		path: ["confirmPassword"],
	});

export const loginBodySchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});
