export function validateBody(schema) {
	return (req, res, next) => {
		const parsed = schema.safeParse(req.body);
		if (!parsed.success) {
			const first = parsed.error.issues[0];
			const msg = first ? `${first.path.join(".")}: ${first.message}` : "Invalid input";
			return res.status(400).json({ error: msg });
		}
		req.validatedBody = parsed.data;
		next();
	};
}
