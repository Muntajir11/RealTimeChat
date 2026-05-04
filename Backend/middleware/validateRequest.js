function fail(parsed, res) {
	const first = parsed.error.issues[0];
	const msg = first ? `${first.path.join(".")}: ${first.message}` : "Invalid input";
	return res.status(400).json({ error: msg });
}

export function validateBody(schema) {
	return (req, res, next) => {
		const parsed = schema.safeParse(req.body);
		if (!parsed.success) return fail(parsed, res);
		req.validatedBody = parsed.data;
		next();
	};
}

export function validateQuery(schema) {
	return (req, res, next) => {
		const parsed = schema.safeParse(req.query);
		if (!parsed.success) return fail(parsed, res);
		req.validatedQuery = parsed.data;
		next();
	};
}

export function validateParams(schema) {
	return (req, res, next) => {
		const parsed = schema.safeParse(req.params);
		if (!parsed.success) return fail(parsed, res);
		req.validatedParams = parsed.data;
		next();
	};
}
