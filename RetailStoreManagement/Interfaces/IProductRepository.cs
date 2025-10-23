using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface IProductRepository : IRepository<ProductEntity, int>
{
    Task<IEnumerable<ProductEntity>> SearchByNameOrBarcodeAsync(string keyword);
    Task<IEnumerable<ProductEntity>> FilterByCategoryAndSupplierAsync(int? categoryId, int? supplierId);
}
    