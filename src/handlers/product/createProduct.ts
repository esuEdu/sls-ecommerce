import { APIGatewayProxyHandler } from "aws-lambda";
import {
	createdResponse,
	validationErrorResponse,
	badRequestResponse,
} from "../../utils/resp";
import { ProductService } from "../../services/product.service";
import { ZodError } from "zod";

const service = new ProductService();

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		if (!event.body) {
			return badRequestResponse("Request body is required");
		}

		const rawBody = JSON.parse(event.body);

		const product = await service.createProduct(rawBody);

		return createdResponse("Product created successfully", product);
	} catch (error) {
		if (error instanceof ZodError) {
			return validationErrorResponse(error.issues);
		}
		if (error instanceof SyntaxError) {
			return badRequestResponse("Invalid JSON format in request body");
		}
		throw error;
	}
};
