import { Entity } from "electrodb";
import DynamoDB from "aws-sdk/clients/dynamodb";

const client = new DynamoDB.DocumentClient();

export const CartEntity = new Entity(
	{
		model: {
			entity: "Cart",
			version: "1",
			service: "ecommerce",
		},
		attributes: {
			userId: { type: "string", required: true },
			items: {
				type: "list",
				items: {
					type: "map",
					properties: {
						productId: { type: "string", required: true },
						quantity: { type: "number", required: true },
					},
				},
				default: [],
			},
			createdAt: {
				type: "string",
				default: () => new Date().toISOString(),
			},
			updatedAt: {
				type: "string",
				watch: "*",
				set: () => new Date().toISOString(),
			},
		},
		indexes: {
			cart: {
				pk: { field: "pk", composite: ["userId"] },
				sk: { field: "sk", composite: [] },
			},
		},
	},
	{
		client: client,
		table: process.env.CARTS_TABLE || "carts",
	}
);
