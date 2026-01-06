import { UserEntity } from "../user.entity";
import { listUsersSchema } from "../schemas/user.schema";
import { ok } from "../../../libs/utils/responses";
import { APIGatewayProxyEvent } from "aws-lambda";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const params = listUsersSchema.parse(event.queryStringParameters || {});
		const { role, search, limit, cursor } = params;

		let query;

		if (search) {
			query = UserEntity.query.search({
				nameLower: search.toLowerCase(),
			});
		} else {
			query = UserEntity.query.list({});
		}

		if (role) {
			query = query.where(({ role: userRole }, { eq }) =>
				eq(userRole, role)
			);
		}

		const result = await query.go({
			limit,
			cursor,
		});

		const sanitizedData = result.data.map((user) => {
			const { hashPassword, ...userWithoutPassword } = user;
			return userWithoutPassword;
		});

		return ok({
			items: sanitizedData,
			cursor: result.cursor,
		});
	}
);
