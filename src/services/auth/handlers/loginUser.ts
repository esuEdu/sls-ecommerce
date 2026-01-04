import { created } from "../../../libs/utils/responses";
import { UserEntity } from "../../users/user.entity";
import { loginSchema } from "../schemas/auth.schema";
import { parseBody } from "../../../libs/validation/parseBody";
import { comparePassword } from "../../../libs/auth/hash";
import { generateToken } from "../../../libs/auth/jwt";
import { unauthorized } from "../../../libs/utils/errors";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const body = parseBody(loginSchema, event.body);

		const result = await UserEntity.query
			.byEmail({ email: body.email })
			.go();

		const user = result.data[0];

		if (!user) {
			throw unauthorized("Invalid email or password");
		}

		const isValid = await comparePassword(user.hashPassword, body.password);

		if (!isValid) {
			throw unauthorized("Invalid email or password");
		}

		const token = await generateToken(user.userId, user.role);

		return created({
			token,
			user: {
				userId: user.userId,
				email: user.email,
				role: user.role,
			},
		});
	}
);
