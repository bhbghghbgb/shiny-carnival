using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Supplier;

namespace RetailStoreManagement.Interfaces.Services;

public interface ISupplierService
{
    Task<ApiResponse<PagedList<SupplierResponseDto>>> GetSuppliersAsync(PagedRequest request);
    Task<ApiResponse<SupplierResponseDto>> GetSupplierByIdAsync(int id);
    Task<ApiResponse<SupplierResponseDto>> CreateSupplierAsync(CreateSupplierRequest request);
    Task<ApiResponse<SupplierResponseDto>> UpdateSupplierAsync(int id, UpdateSupplierRequest request);
    Task<ApiResponse<bool>> DeleteSupplierAsync(int id);
}
