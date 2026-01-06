import { UserEntity } from "../user.entity";
import { ok } from "../../../libs/utils/responses";
import { notFound } from "../../../libs/utils/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const userId = event.pathParameters?.id;

		if (!userId) {
			throw notFound("User ID is required");
		}

		const result = await UserEntity.get({ userId }).go();

		if (!result.data) {
			throw notFound(`User with id ${userId} not found`);
		}

		const { hashPassword, ...userWithoutPassword } = result.data;

		return ok(userWithoutPassword);
	}
);
