import { ZodType } from "zod";
import { APIGatewayProxyEvent } from "aws-lambda";

export function parseBody<T>(
	schema: ZodType<T>,
	body?: APIGatewayProxyEvent["body"]
): T {
	return schema.parse(JSON.parse(body ?? "{}"));
}
