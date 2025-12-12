import type { PagedRequest } from "../../../lib/api/types/api.types";

export interface UpdateInventoryRequest {
    quantityChange: number;
    reason: string;
}

export interface InventoryFilterParams extends PagedRequest {
    productId?: number;
    minQuantity?: number;
    maxQuantity?: number;
    search?: string;
    sortBy?: string;
    sortDesc?: boolean;
}

export interface InventoryHistoryEntry {
    historyId?: number;
    productId: number;
    quantityChange: number;
    reason: string;
    createdAt?: string;
}