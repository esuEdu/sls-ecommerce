import { ProductRepository } from "../repository/product.repo";
import { ProductModel } from "../models/product.model";
import {
	createProductSchema,
	updateProductSchema,
} from "../schemas/product.schema";
import { generateId } from "../utils/uuid";
import z from "zod";

export class ProductService {
	private repo = new ProductRepository();

	async createProduct(
		data: z.infer<typeof createProductSchema>
	): Promise<ProductModel> {
		createProductSchema.parse(data);

		const now = new Date().toISOString();

		const product: ProductModel = {
			productId: generateId(),
			name: data.name,
			price: data.price,
			description: data.description,
			stock: data.stock,
			category: data.category,
			createdAt: now,
			updatedAt: now,
		};

		return await this.repo.create(product);
	}

	async getProduct(id: string): Promise<ProductModel | null> {
		return await this.repo.getById(id);
	}

	async listProducts(): Promise<ProductModel[]> {
		return await this.repo.list();
	}

	async updateProduct(
		id: string,
		data: z.infer<typeof updateProductSchema>
	): Promise<ProductModel | null> {
		updateProductSchema.parse(data);

		return await this.repo.update(id, data);
	}

	async deleteProduct(id: string): Promise<boolean> {
		const existing = await this.repo.getById(id);
		if (!existing) return false;

		await this.repo.delete(id);
		return true;
	}
}
