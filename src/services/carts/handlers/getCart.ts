import { CartEntity } from "../cart.entity";
import { ok } from "../../../libs/utils/responses";
import { forbidden } from "../../../libs/utils/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const userId = event.requestContext.authorizer?.lambda?.userId as
			| string
			| undefined;

		if (!userId) {
			throw forbidden("User not authenticated");
		}

		const result = await CartEntity.get({ userId }).go();

		if (!result.data) {
			return ok({
				userId,
				items: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});
		}

		return ok(result.data);
	}
);
