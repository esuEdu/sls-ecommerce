export const ok = (data: unknown) => ({
	statusCode: 200,
	body: JSON.stringify(data),
});

export const created = (data: unknown) => ({
	statusCode: 201,
	body: JSON.stringify(data),
});

export const noContent = () => ({
	statusCode: 204,
});
