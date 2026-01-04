import { z } from "zod";

export const createProductSchema = z.object({
	name: z.string().min(3),
	description: z.string().optional(),
	category: z.string().min(2),
	price: z.number().positive(),
	stock: z.number().int().nonnegative(),
	imageUrl: z.string().url().optional(),
});

export const listProductsSchema = z.object({
	category: z.string().optional(),
	minPrice: z.coerce.number().optional(),
	maxPrice: z.coerce.number().optional(),
	search: z.string().optional(),
	limit: z.coerce.number().min(1).max(50).default(10),
	cursor: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();
