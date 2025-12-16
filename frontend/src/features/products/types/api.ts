import type { ProductEntity } from "./entity.ts";

export interface CreateProductRequest {
    categoryId: number;
    supplierId: number;
    productName: string;
    barcode: string;
    price: number;
    unit: string;
    imageUrl?: string;
    imageFileId?: string;
}

export interface UpdateProductRequest {
    categoryId?: number;
    supplierId?: number;
    productName?: string;
    barcode?: string;
    price?: number;
    unit?: string;
    imageUrl?: string;
    imageFileId?: string;
}
