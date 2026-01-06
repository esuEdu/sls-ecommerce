import { UserEntity } from "../user.entity";
import { ok } from "../../../libs/utils/responses";
import { notFound, forbidden } from "../../../libs/utils/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";
import { updateUserSchema } from "../schemas/user.schema";
import { parseBody } from "../../../libs/validation/parseBody";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const userId = event.pathParameters?.id;
		const authenticatedUserId = event.requestContext.authorizer?.lambda
			?.userId as string | undefined;
		const authenticatedUserRole = event.requestContext.authorizer?.lambda
			?.role as string | undefined;

		if (!userId) {
			throw notFound("User ID is required");
		}

		if (!authenticatedUserId) {
			throw forbidden("User not authenticated");
		}

		if (userId !== authenticatedUserId) {
			throw forbidden("You can only update your own profile");
		}

		const updateData = parseBody(updateUserSchema, event.body);

		const existingUser = await UserEntity.get({ userId }).go();

		if (!existingUser.data) {
			throw notFound(`User with id ${userId} not found`);
		}

		if (updateData.role) {
			throw forbidden("You cannot change your own role");
		}

		if (updateData.status) {
			throw forbidden("You cannot change your own status");
		}

		const result = await UserEntity.update({ userId })
			.set(updateData)
			.go({ response: "all_new" });

		const { hashPassword, ...userWithoutPassword } = result.data;

		return ok(userWithoutPassword);
	}
);
