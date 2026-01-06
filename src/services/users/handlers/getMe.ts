import { UserEntity } from "../user.entity";
import { ok } from "../../../libs/utils/responses";
import { notFound } from "../../../libs/utils/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const userId = event.requestContext.authorizer?.lambda?.userId as
			| string
			| undefined;

		if (!userId) {
			throw notFound("User not authenticated");
		}

		const result = await UserEntity.get({ userId }).go();

		if (!result.data) {
			throw notFound(`User not found`);
		}

		const { hashPassword, ...userWithoutPassword } = result.data;

		return ok(userWithoutPassword);
	}
);
