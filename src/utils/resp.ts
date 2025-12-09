export function resp(statusCode: number, body: any) {
	return {
		statusCode,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	};
}

export function successResponse(message: string, data?: any) {
	return resp(200, {
		message,
		...(data && { data }),
	});
}

export function createdResponse(message: string, data: any) {
	return resp(201, {
		message,
		data,
	});
}

export function notFoundResponse(resource: string, id?: string) {
	const message = id
		? `${resource} with ID '${id}' was not found`
		: `${resource} not found`;
	return resp(404, {
		error: "Not Found",
		message,
	});
}

export function badRequestResponse(message: string, errors?: any) {
	return resp(400, {
		error: "Bad Request",
		message,
		...(errors && { errors }),
	});
}

export function validationErrorResponse(errors: any) {
	return resp(400, {
		error: "Validation Error",
		message: "The request contains invalid data",
		errors,
	});
}
