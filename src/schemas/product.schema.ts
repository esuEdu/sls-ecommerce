import { z } from "zod";

export const createProductSchema = z.object({
	name: z.string().min(1),
	price: z.number().int().nonnegative(),
	description: z.string().optional(),
	stock: z.number().int().nonnegative().default(0),
	stockReserved: z.number().int().nonnegative().default(0),
	category: z.string().min(1),
});

export const updateProductSchema = z
	.object({
		name: z.string().min(1).optional(),
		price: z.number().nonnegative().optional(),
		description: z.string().optional(),
		stock: z.number().int().nonnegative().optional(),
		stockReserved: z.number().int().nonnegative().optional(),
		category: z.string().min(1).optional(),
	})
	.strict();

export const productResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	price: z.number(),
	description: z.string().optional(),
	stock: z.number(),
	stockReserved: z.number(),
	category: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
