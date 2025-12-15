// Types cho Product API
export interface ProductEntity {
    id: number;
    categoryId: number;
    supplierId: number;
    productName: string;
    barcode: string;
    price: number;
    unit: string;
}

// Extended Product with Details (from ProductResponseDto)
export interface ProductDetailsDto extends ProductEntity {
    categoryName?: string;
    supplierName?: string;
    inventoryQuantity: number;
    createdAt?: string;
}