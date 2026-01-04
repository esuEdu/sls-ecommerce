import { APIGatewayProxyEvent } from "aws-lambda";

type JwtAuthorizer = {
	jwt: {
		claims: Record<string, string>;
	};
};

export function requireAdmin(
	event: APIGatewayProxyEvent
): asserts event is APIGatewayProxyEvent & {
	requestContext: { authorizer: JwtAuthorizer };
} {
	const authorizer = event.requestContext.authorizer;

	if (!authorizer || !("jwt" in authorizer)) {
		throw new Error("Unauthorized");
	}

	if (authorizer.jwt.claims["custom:role"] !== "admin") {
		throw new Error("Forbidden");
	}
}
