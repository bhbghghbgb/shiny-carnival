import axiosClient, { type ApiResponse, type PagedList } from '../../../lib/api/axios.ts';
import { API_CONFIG } from '../../../config/api.config.ts';
import type { InventoryEntity } from "../types/inventoryEntity.ts";
import type { InventoryFilterParams, InventoryHistoryEntry, UpdateInventoryRequest } from "../types/api.ts";

// Inventory API functions
export const inventoryApi = {
  /**
   * Lấy danh sách tồn kho với phân trang và filter
   */
  getInventories: async (params?: InventoryFilterParams): Promise<ApiResponse<PagedList<InventoryEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<InventoryEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.INVENTORY,
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách tồn kho',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy thông tin tồn kho theo productId
   */
  getInventoryByProduct: async (productId: number): Promise<ApiResponse<InventoryEntity>> => {
    try {
      const response = await axiosClient.get<ApiResponse<InventoryEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_BY_PRODUCT(productId)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy thông tin tồn kho',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật số lượng tồn kho (Staff/Admin)
   */
  updateInventory: async (productId: number, updateData: UpdateInventoryRequest): Promise<ApiResponse<InventoryEntity>> => {
    try {
      const response = await axiosClient.patch<ApiResponse<InventoryEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_BY_PRODUCT(productId),
        updateData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật tồn kho',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Nhập hàng (tăng tồn kho)
   */
  stockIn: async (productId: number, quantity: number, reason?: string): Promise<ApiResponse<InventoryEntity>> => {
    return inventoryApi.updateInventory(productId, {
      quantityChange: Math.abs(quantity), // Đảm bảo số dương
      reason: reason || 'Nhập hàng'
    });
  },

  /**
   * Xuất hàng (giảm tồn kho)
   */
  stockOut: async (productId: number, quantity: number, reason?: string): Promise<ApiResponse<InventoryEntity>> => {
    return inventoryApi.updateInventory(productId, {
      quantityChange: -Math.abs(quantity), // Đảm bảo số âm
      reason: reason || 'Xuất hàng'
    });
  },

  /**
   * Kiểm kê tồn kho
   */
  stockTake: async (productId: number, actualQuantity: number): Promise<ApiResponse<InventoryEntity>> => {
    try {
      // Lấy số lượng hiện tại
      const currentInventory = await inventoryApi.getInventoryByProduct(productId);

      if (currentInventory.isError || !currentInventory.data) {
        throw new Error('Không thể lấy thông tin tồn kho hiện tại');
      }

      const currentQuantity = currentInventory.data.quantity;
      const difference = actualQuantity - currentQuantity;

      if (difference === 0) {
        return currentInventory;
      }

      return inventoryApi.updateInventory(productId, {
        quantityChange: difference,
        reason: `Kiểm kê: từ ${currentQuantity} thành ${actualQuantity}`
      });
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể thực hiện kiểm kê',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy danh sách sản phẩm tồn kho thấp
   */
  getLowStock: async (): Promise<ApiResponse<InventoryEntity[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<InventoryEntity[]>>(
        API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_LOW_STOCK
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách tồn kho thấp',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lịch sử thay đổi tồn kho theo productId
   */
  getInventoryHistory: async (
    productId: number,
    params?: InventoryFilterParams
  ): Promise<ApiResponse<PagedList<InventoryHistoryEntry>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<InventoryHistoryEntry>>>(
        API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_HISTORY(productId),
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy lịch sử tồn kho',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default inventoryApi;
