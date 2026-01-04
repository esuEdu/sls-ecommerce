import { randomUUID } from "crypto";
import { created } from "../../../libs/utils/responses";
import { UserEntity } from "../../users/user.entity";
import { registerSchema } from "../schemas/auth.schema";
import { parseBody } from "../../../libs/validation/parseBody";
import { hashPassword } from "../../../libs/auth/hash";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const body = parseBody(registerSchema, event.body);

		const { password, ...userData } = body;

		const hash = await hashPassword(password);

		const user = await UserEntity.create({
			userId: randomUUID(),
			hashPassword: hash,
			...userData,
		}).go();

		return created({
			userId: user.data.userId,
			email: user.data.email,
			role: user.data.role,
		});
	}
);
