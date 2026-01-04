import { ProductEntity } from "../product.entity";
import { listProductsSchema } from "../schemas/product.schema";
import { ok } from "../../../libs/utils/responses";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
	const params = listProductsSchema.parse(event.queryStringParameters || {});
	const { category, minPrice, maxPrice, search, limit, cursor } = params;

	let query;

	if (search) {
		query = ProductEntity.query.search({
			nameLower: search.toLowerCase(),
		});
	} else if (category) {
		query = ProductEntity.query.byCategory({ category });
	} else {
		query = ProductEntity.query.list({});
	}

	if (minPrice !== undefined) {
		query = query.where(({ price }, { gte }) => gte(price, minPrice));
	}

	if (maxPrice !== undefined) {
		query = query.where(({ price }, { lte }) => lte(price, maxPrice));
	}

	const result = await query.go({
		limit,
		cursor,
	});

	return ok({
		items: result.data,
		cursor: result.cursor,
	});
};
