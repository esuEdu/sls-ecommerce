import { APIGatewayProxyHandler } from "aws-lambda";
import { successResponse } from "../../utils/resp";
import { ProductService } from "../../services/product.service";

const service = new ProductService();

export const handler: APIGatewayProxyHandler = async (event) => {
	const products = await service.listProducts();

	return successResponse(
		products.length > 0
			? `Successfully retrieved ${products.length} product${
					products.length === 1 ? "" : "s"
			  }`
			: "No products found",
		products
	);
};
