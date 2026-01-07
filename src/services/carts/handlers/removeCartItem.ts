import { CartEntity } from "../cart.entity";
import { ok } from "../../../libs/utils/responses";
import { forbidden, notFound, badRequest } from "../../../libs/utils/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { withErrorHandling } from "../../../libs/utils/withErrorHandling";

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

		const cart = await CartEntity.get({ userId }).go();
		if (!cart.data || !cart.data.items) {
			throw notFound("Cart not found");
		}

		const itemIndex = cart.data.items.findIndex(
			(item: { productId: string }) => item.productId === productId
		);

		if (itemIndex === -1) {
			throw notFound(`Product ${productId} not found in cart`);
		}

		const updatedItems = cart.data.items.filter(
			(item: { productId: string }) => item.productId !== productId
		);

		const result = await CartEntity.update({ userId })
			.set({ items: updatedItems })
			.go({ response: "all_new" });

		return ok(result.data);
	}
);
