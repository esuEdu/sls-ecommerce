import { ProductEntity } from "../product.entity";
import { ok } from "../../../libs/utils/responses";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
	const productId = event.pathParameters?.productId;

	if (!productId) {
		throw new Error("Missing productId");
	}
	const result = await ProductEntity.get({ productId }).go();

	return ok(result.data);
};
