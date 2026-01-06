import { z } from "zod";

export const listUsersSchema = z.object({
	role: z.string().optional(),
	search: z.string().optional(),
	limit: z.coerce.number().min(1).max(50).default(10),
	cursor: z.string().optional(),
});

export const updateUserSchema = z.object({
	name: z.string().min(3).optional(),
	role: z.enum(["USER", "ADMIN"]).optional(),
	status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
