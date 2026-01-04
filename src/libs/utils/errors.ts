export class HttpError extends Error {
	constructor(
		public statusCode: number,
		message: string,
		public code?: string
	) {
		super(message);
	}
}

export const badRequest = (message: string, code?: string) =>
	new HttpError(400, message, code);

export const unauthorized = (message = "Unauthorized") =>
	new HttpError(401, message, "UNAUTHORIZED");

export const forbidden = (message = "Forbidden") =>
	new HttpError(403, message, "FORBIDDEN");

export const notFound = (message: string) =>
	new HttpError(404, message, "NOT_FOUND");
