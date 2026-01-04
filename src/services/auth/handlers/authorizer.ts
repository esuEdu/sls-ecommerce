import { APIGatewayRequestAuthorizerEventV2 } from "aws-lambda";
import { verifyToken } from "../../../libs/auth/jwt";

type SimpleAuthorizerResponse = {
	isAuthorized: boolean;
	context?: Record<string, string | number | boolean>;
};

const unauthorizedResponse: SimpleAuthorizerResponse = {
	isAuthorized: false,
};

export const handler = async (
	event: APIGatewayRequestAuthorizerEventV2
): Promise<SimpleAuthorizerResponse> => {
	const authHeader =
		event.headers?.authorization || event.headers?.Authorization;

	if (!authHeader) {
		return unauthorizedResponse;
	}

	const [scheme, token] = authHeader.split(" ");

	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return unauthorizedResponse;
	}

	try {
		const payload = verifyToken(token);

		return {
			isAuthorized: true,
			context: {
				userId: payload.userId,
				role: payload.role,
			},
		};
	} catch (error) {
		console.error("Authorization failed", error);
		return unauthorizedResponse;
	}
};
