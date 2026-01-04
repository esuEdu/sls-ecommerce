import { APIGatewayProxyEvent } from "aws-lambda";
import { forbidden, unauthorized } from "../utils/errors";

type JwtAuthorizer = {
	jwt: {
		claims: Record<string, string>;
	};
};

type AuthorizerContext = Partial<JwtAuthorizer & { role?: string }>;

export function requireAdmin(
	event: APIGatewayProxyEvent
): asserts event is APIGatewayProxyEvent & {
	requestContext: { authorizer: AuthorizerContext };
} {
	const authorizer = event.requestContext.authorizer as AuthorizerContext;

	const role = authorizer?.role ?? authorizer?.jwt?.claims?.role;

	if (!role) {
		throw unauthorized();
	}

	if (role !== "admin") {
		throw forbidden();
	}
}
