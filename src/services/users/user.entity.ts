import { Entity } from "electrodb";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { tr } from "zod/v4/locales";

const client = new DynamoDB.DocumentClient();

export const UserEntity = new Entity(
	{
		model: {
			entity: "User",
			version: "1",
			service: "ecommerce",
		},
		attributes: {
			userId: { type: "string", required: true },
			name: { type: "string", required: true },
			nameLower: {
				type: "string",
				set: (_, { name }) => name.toLowerCase(),
			},
			email: { type: "string", required: true },
			hashPassword: { type: "string", required: true },
			role: { type: "string", required: true, default: "USER" },
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
			user: {
				pk: { field: "pk", composite: ["userId"] },
				sk: { field: "sk", composite: [] },
			},

			byEmail: {
				index: "gsi1",
				pk: { field: "gsi1pk", composite: ["email"] },
				sk: { field: "gsi1sk", composite: [] },
			},

			list: {
				index: "gsi2",
				pk: { field: "gsi2pk", composite: [] },
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
		table: process.env.USERS_TABLE || "users",
	}
);
