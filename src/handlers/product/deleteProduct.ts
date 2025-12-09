import { APIGatewayProxyHandler } from "aws-lambda";
import {
	badRequestResponse,
	notFoundResponse,
	successResponse,
} from "../../utils/resp";
import { ProductService } from "../../services/product.service";

const service = new ProductService();

export const handler: APIGatewayProxyHandler = async (event) => {
	const id = event.pathParameters?.id;

	if (!id) {
		return badRequestResponse(
			"Product ID is required in the path parameters"
		);
	}

	const deleted = await service.deleteProduct(id);

	if (!deleted) {
		return notFoundResponse("Product", id);
	}

	return successResponse("Product deleted successfully");
};
