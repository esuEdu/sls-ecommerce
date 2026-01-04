import { ProductEntity } from "../product.entity";
import { ok } from "../../../libs/utils/responses";
import { badRequest, notFound } from "../../../libs/utils/errors";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const productId = event.pathParameters?.productId;

		if (!productId) {
			throw badRequest("productId is required");
		}

		const result = await ProductEntity.get({ productId }).go();

		if (!result.data) {
			throw notFound("Product not found");
		}

		return ok(result.data);
	}
);
