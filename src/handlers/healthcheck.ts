import { APIGatewayProxyHandler } from "aws-lambda";
import { resp } from "../utils/resp";

export const handler: APIGatewayProxyHandler = async (event) => {
	return resp(200, {
		message: "Check",
	});
};
