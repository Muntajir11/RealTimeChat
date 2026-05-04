import { HttpError } from "../errors/HttpError.js";

export default function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}

	const status = err instanceof HttpError ? err.status : 500;
	const message =
		status === 500 && process.env.NODE_ENV === "production"
			? "Internal Server Error"
			: err.message || "Internal Server Error";

	if (status === 500) {
		console.error(err);
	}

	res.status(status).json({ error: message });
}
