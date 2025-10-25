using RetailStoreManagement.Entities;
using System.Linq;

namespace RetailStoreManagement.Interfaces;

public interface IProductRepository : IRepository<ProductEntity, int>
{
    Task<IEnumerable<ProductEntity>> SearchAsync(string keyword);
    Task<IEnumerable<ProductEntity>> FilterAsync(int? categoryId, int? supplierId);
}
    