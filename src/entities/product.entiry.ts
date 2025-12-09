import { Entity } from "electrodb";
import { client } from "../config/dynamo.config";

export const ProductEntity = new Entity(
	{
		model: {
			entity: "product",
			version: "1",
			service: "sls-ecommerce",
		},
		attributes: {
			productId: {
				type: "string",
				required: true,
			},
			name: {
				type: "string",
				required: true,
			},
			price: {
				type: "number",
				required: true,
			},
			description: {
				type: "string",
			},
			stock: {
				type: "number",
				required: true,
			},
			category: {
				type: "string",
				required: true,
			},
			createdAt: {
				type: "string",
				readOnly: true,
				default: () => new Date().toISOString(),
			},
			updatedAt: {
				type: "string",
				watch: ["name", "price", "description", "stock", "category"],
				default: () => new Date().toISOString(),
				set: () => new Date().toISOString(),
			},
		},
		indexes: {
			primary: {
				pk: {
					field: "pk",
					composite: ["productId"],
				},
			},
		},
	},
	{
		table: "products",
		client,
	}
);
