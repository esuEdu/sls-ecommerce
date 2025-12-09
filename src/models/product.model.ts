export interface ProductModel {
	productId: string;
	name: string;
	price: number;
	description?: string;
	stock: number;
	category: string;

	// DynamoDB internal fields
	createdAt: string;
	updatedAt: string;
}
