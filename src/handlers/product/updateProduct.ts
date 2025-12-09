import { APIGatewayProxyHandler } from "aws-lambda";
import {
	badRequestResponse,
	notFoundResponse,
	successResponse,
	validationErrorResponse,
} from "../../utils/resp";
import { ProductService } from "../../services/product.service";
import { ZodError } from "zod";

const service = new ProductService();

export const handler: APIGatewayProxyHandler = async (event) => {
	const id = event.pathParameters?.id;

	if (!id) {
		return badRequestResponse(
			"Product ID is required in the path parameters"
		);
	}

	try {
		const rawBody = JSON.parse(event.body || "{}");

		const product = await service.updateProduct(id, rawBody);

		if (!product) {
			return notFoundResponse("Product", id);
		}

		return successResponse("Product updated successfully", product);
	} catch (error) {
		if (error instanceof ZodError) {
			return validationErrorResponse(error.issues);
		}
		throw error;
	}
};
