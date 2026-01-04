import { randomUUID } from "crypto";
import { ProductEntity } from "../product.entity";
import { createProductSchema } from "../schemas/product.schema";
import { parseBody } from "../../../libs/validation/parseBody";
import { created } from "../../../libs/utils/responses";
import { requireAdmin } from "../../../libs/auth/requireAdmin";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
	requireAdmin(event);

	const body = parseBody(createProductSchema, event.body);

	const product = await ProductEntity.create({
		productId: randomUUID(),
		...body,
	}).go();

	return created(product.data);
};
