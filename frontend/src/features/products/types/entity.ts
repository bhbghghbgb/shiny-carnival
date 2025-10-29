// Types cho Product API
export interface ProductEntity {
    id?: number;
    categoryId: number;
    supplierId: number;
    productName: string;
    barcode: string;
    price: number;
    unit: string;
    createdAt: Date;
    updateAt: Date;
    deleteAt: Date;
    isDelete: boolean;
}