import { ProductModel } from "../models/product.model";
import { ProductEntity } from "../entities/product.entiry";

const TABLE_NAME = process.env.PRODUCTS_TABLE!;

export class ProductRepository {
	async create(product: ProductModel): Promise<ProductModel> {
		const result = await ProductEntity.create(product).go();
		return result.data as ProductModel;
	}

	async getById(id: string): Promise<ProductModel | null> {
		const result = await ProductEntity.get({ productId: id }).go();
		return (result.data as ProductModel) ?? null;
	}

	async update(
		id: string,
		updates: Partial<ProductModel>
	): Promise<ProductModel | null> {
		const existing = await this.getById(id);
		if (!existing) return null;

		const result = await ProductEntity.update({ productId: id })
			.set(updates)
			.go();

		return result.data as ProductModel;
	}

	async delete(id: string): Promise<void> {
		await ProductEntity.delete({ productId: id }).go();
	}

	async list(): Promise<ProductModel[]> {
		const result = await ProductEntity.scan.go(); // electro: .scan.go()
		return (result.data as ProductModel[]) ?? [];
	}
}
