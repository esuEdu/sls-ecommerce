type ResponseBody = Record<string, unknown> | unknown;

const json = (statusCode: number, body?: ResponseBody) => ({
	statusCode,
	headers: {
		"Content-Type": "application/json",
	},
	body: body ? JSON.stringify(body) : undefined,
});

export const ok = (data: ResponseBody) => json(200, data);

export const created = (data: ResponseBody) => json(201, data);

export const noContent = () => ({
	statusCode: 204,
});
