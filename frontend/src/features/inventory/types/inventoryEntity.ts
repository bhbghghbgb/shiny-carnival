// Types cho Inventory API
export interface InventoryEntity {
    inventoryId: number;
    productId: number;
    productName: string;
    barcode: string;
    quantity: number;
    updatedAt: string;
    status: string; // 'in_stock' | 'low_stock' | 'out_of_stock'
}