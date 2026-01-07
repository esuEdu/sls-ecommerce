import { CartEntity } from "../cart.entity";
import { ProductEntity } from "../../products/product.entity";
import { ok } from "../../../libs/utils/responses";
import { forbidden, notFound, badRequest } from "../../../libs/utils/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";
import { addItemToCartSchema } from "../schemas/cart.schema";
import { parseBody } from "../../../libs/validation/parseBody";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const userId = event.requestContext.authorizer?.lambda?.userId as
			| string
			| undefined;

		if (!userId) {
			throw forbidden("User not authenticated");
		}

		const { productId, quantity } = parseBody(
			addItemToCartSchema,
			event.body
		);

		const product = await ProductEntity.get({ productId }).go();
		if (!product.data) {
			throw notFound(`Product with id ${productId} not found`);
		}

		if (product.data.stock < quantity) {
			throw badRequest(
				`Insufficient stock. Available: ${product.data.stock}`
			);
		}

		const existingCart = await CartEntity.get({ userId }).go();

		if (!existingCart.data) {
			const result = await CartEntity.create({
				userId,
				items: [{ productId, quantity }],
			}).go();

			return ok(result.data);
		}

		const items = existingCart.data.items || [];
		const existingItemIndex = items.findIndex(
			(item: { productId: string }) => item.productId === productId
		);

		let updatedItems;
		if (existingItemIndex >= 0) {
			updatedItems = [...items];
			updatedItems[existingItemIndex].quantity += quantity;

			if (product.data.stock < updatedItems[existingItemIndex].quantity) {
				throw badRequest(
					`Insufficient stock. Available: ${product.data.stock}`
				);
			}
		} else {
			updatedItems = [...items, { productId, quantity }];
		}

		const result = await CartEntity.update({ userId })
			.set({ items: updatedItems })
			.go({ response: "all_new" });

		return ok(result.data);
	}
);
