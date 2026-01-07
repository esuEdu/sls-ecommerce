import { CartEntity } from "../cart.entity";
import { ProductEntity } from "../../products/product.entity";
import { ok } from "../../../libs/utils/responses";
import { forbidden, notFound, badRequest } from "../../../libs/utils/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";
import { updateCartItemSchema } from "../schemas/cart.schema";
import { parseBody } from "../../../libs/validation/parseBody";

export const handler = withErrorHandling(
	async (event: APIGatewayProxyEvent) => {
		const userId = event.requestContext.authorizer?.lambda?.userId as
			| string
			| undefined;
		const productId = event.pathParameters?.productId;

		if (!userId) {
			throw forbidden("User not authenticated");
		}

		if (!productId) {
			throw badRequest("Product ID is required");
		}

		const { quantity } = parseBody(updateCartItemSchema, event.body);

		const product = await ProductEntity.get({ productId }).go();
		if (!product.data) {
			throw notFound(`Product with id ${productId} not found`);
		}

		if (product.data.stock < quantity) {
			throw badRequest(
				`Insufficient stock. Available: ${product.data.stock}`
			);
		}

		const cart = await CartEntity.get({ userId }).go();
		if (!cart.data) {
			throw notFound("Cart not found");
		}

		const items = cart.data.items || [];

		const itemIndex = items.findIndex(
			(item: { productId: string }) => item.productId === productId
		);

		if (itemIndex === -1) {
			throw notFound(`Product ${productId} not found in cart`);
		}

		const updatedItems = [...items];
		updatedItems[itemIndex].quantity = quantity;

		const result = await CartEntity.update({ userId })
			.set({ items: updatedItems })
			.go({ response: "all_new" });

		return ok(result.data);
	}
);
