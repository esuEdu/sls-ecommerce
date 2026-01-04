import { HttpError } from "./errors";

export const withErrorHandling =
	(handler: Function) => async (event: any, context: any) => {
		try {
			return await handler(event, context);
		} catch (err: any) {
			console.error(err);

			if (err instanceof HttpError) {
				return {
					statusCode: err.statusCode,
					body: JSON.stringify({
						error: {
							message: err.message,
							code: err.code,
						},
					}),
				};
			}

			return {
				statusCode: 500,
				body: JSON.stringify({
					error: {
						message: "Internal server error",
						code: "INTERNAL_ERROR",
					},
				}),
			};
		}
	};
