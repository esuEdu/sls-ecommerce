import { ProductEntity } from "../product.entity";
import { noContent } from "../../../libs/utils/responses";
import { requireAdmin } from "../../../libs/auth/requireAdmin";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
	requireAdmin(event);

	const productId = event.pathParameters?.productId;

	if (!productId) {
		throw new Error("Missing productId");
	}

	await ProductEntity.delete({ productId }).go();

	return noContent();
};
