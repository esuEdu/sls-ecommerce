import { ProductEntity } from "../product.entity";
import { updateProductSchema } from "../schemas/product.schema";
import { parseBody } from "../../../libs/validation/parseBody";
import { ok } from "../../../libs/utils/responses";
import { requireAdmin } from "../../../libs/auth/requireAdmin";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
	requireAdmin(event);

	const productId = event.pathParameters?.productId;

	if (!productId) {
		throw new Error("Missing productId");
	}

	const body = parseBody(updateProductSchema, event.body);

	const product = await ProductEntity.update({
		productId,
	})
		.set(body)
		.go();

	return ok(product.data);
};
