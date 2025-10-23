using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Services;

public class ProductService : BaseService<ProductEntity, int>, IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
        : base(productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ApiResponse<IEnumerable<ProductEntity>>> SearchAsync(string keyword)
    {
        var products = await _productRepository.SearchByNameOrBarcodeAsync(keyword);
        return ApiResponse<IEnumerable<ProductEntity>>.Success(products);
    }

    public async Task<ApiResponse<IEnumerable<ProductEntity>>> FilterAsync(int? categoryId, int? supplierId)
    {
        var products = await _productRepository.FilterByCategoryAndSupplierAsync(categoryId, supplierId);
        return ApiResponse<IEnumerable<ProductEntity>>.Success(products);
    }
}
