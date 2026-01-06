import { Entity } from "electrodb";
import DynamoDB from "aws-sdk/clients/dynamodb";

const client = new DynamoDB.DocumentClient();

export const ProductEntity = new Entity(
	{
		model: {
			entity: "Product",
			version: "1",
			service: "ecommerce",
		},
		attributes: {
			productId: { type: "string", required: true },
			name: { type: "string", required: true },
			nameLower: {
				type: "string",
				set: (_, { name }) => name.toLowerCase(),
			},
			category: { type: "string", required: true },
			description: { type: "string" },
			price: { type: "number", required: true },
			stock: { type: "number", required: true },
			imageUrl: { type: "string" },
			status: { type: "string", required: true, default: "ACTIVE" },
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
			product: {
				pk: { field: "pk", composite: ["productId"] },
				sk: { field: "sk", composite: [] },
			},

			list: {
				index: "gsi1",
				pk: { field: "gsi1pk", composite: [] },
				sk: { field: "gsi1sk", composite: ["createdAt"] },
			},

			byCategory: {
				index: "gsi2",
				pk: { field: "gsi2pk", composite: ["category"] },
				sk: { field: "gsi2sk", composite: ["createdAt"] },
			},

			search: {
				index: "gsi3",
				pk: { field: "gsi3pk", composite: ["nameLower"] },
				sk: { field: "gsi3sk", composite: ["createdAt"] },
			},
		},
	},
	{
		client: client,
		table: process.env.PRODUCTS_TABLE || "products",
	}
);
