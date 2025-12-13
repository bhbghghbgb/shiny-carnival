using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Supplier;

namespace RetailStoreManagement.Services;

public class SupplierService : ISupplierService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SupplierService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedList<SupplierResponseDto>>> GetSuppliersAsync(SupplierSearchRequest request)
    {
        try
        {
            var query = _unitOfWork.Suppliers.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(s => s.Name.Contains(request.Search) ||
                                        s.Phone.Contains(request.Search) ||
                                        (s.Email != null && s.Email.Contains(request.Search)));
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(s => EF.Property<object>(s, request.SortBy))
                : query.OrderBy(s => EF.Property<object>(s, request.SortBy));

            // Project to DTO and keep IQueryable
            var dtoQuery = query
                .Include(s => s.Products)
                .Select(s => new SupplierResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Phone = s.Phone,
                    Email = s.Email,
                    Address = s.Address,
                    ProductCount = s.Products.Count
                });

            // Use PagedList.CreateAsync for database-level pagination
            var pagedList = await PagedList<SupplierResponseDto>.CreateAsync(dtoQuery, request.Page, request.PageSize);

            return ApiResponse<PagedList<SupplierResponseDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<SupplierResponseDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<SupplierResponseDto>> GetSupplierByIdAsync(int id)
    {
        try
        {
            var supplier = await _unitOfWork.Suppliers.GetQueryable()
                .Include(s => s.Products)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (supplier == null)
            {
                return ApiResponse<SupplierResponseDto>.Error("Supplier not found", 404);
            }

            var supplierDto = _mapper.Map<SupplierResponseDto>(supplier);
            return ApiResponse<SupplierResponseDto>.Success(supplierDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<SupplierResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<SupplierResponseDto>> CreateSupplierAsync(CreateSupplierRequest request)
    {
        try
        {
            var supplier = _mapper.Map<SupplierEntity>(request);

            await _unitOfWork.Suppliers.AddAsync(supplier);
            await _unitOfWork.SaveChangesAsync();

            var supplierDto = _mapper.Map<SupplierResponseDto>(supplier);
            return ApiResponse<SupplierResponseDto>.Success(supplierDto, "Supplier created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<SupplierResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<SupplierResponseDto>> UpdateSupplierAsync(int id, UpdateSupplierRequest request)
    {
        try
        {
            var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
            if (supplier == null)
            {
                return ApiResponse<SupplierResponseDto>.Error("Supplier not found", 404);
            }

            _mapper.Map(request, supplier);

            await _unitOfWork.Suppliers.UpdateAsync(supplier);
            await _unitOfWork.SaveChangesAsync();

            var supplierDto = _mapper.Map<SupplierResponseDto>(supplier);
            return ApiResponse<SupplierResponseDto>.Success(supplierDto, "Supplier updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<SupplierResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<bool>> DeleteSupplierAsync(int id)
    {
        try
        {
            var supplier = await _unitOfWork.Suppliers.GetQueryable()
                .Include(s => s.Products)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (supplier == null)
            {
                return ApiResponse<bool>.Error("Không tìm thấy nhà cung cấp", 404);
            }

            // Kiểm tra xem Supplier có Products không
            var productCount = supplier.Products.Count;
            if (productCount > 0)
            {
                return ApiResponse<bool>.Error(
                    $"Không thể xóa nhà cung cấp này vì đang có {productCount} sản phẩm liên quan. " +
                    "Vui lòng xóa hoặc chuyển các sản phẩm trước khi xóa nhà cung cấp.",
                    400
                );
            }

            await _unitOfWork.Suppliers.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Xóa nhà cung cấp thành công");
        }
        catch (DbUpdateException dbEx)
        {
            // Xử lý lỗi database constraint violation
            if (dbEx.InnerException is PostgresException pgEx)
            {
                // Lỗi foreign key constraint violation (23503) hoặc not null constraint (23502)
                if (pgEx.SqlState == "23503" || pgEx.SqlState == "23502")
                {
                    return ApiResponse<bool>.Error(
                        "Không thể xóa nhà cung cấp này vì đang có sản phẩm liên quan. " +
                        "Vui lòng xóa hoặc chuyển các sản phẩm trước khi xóa nhà cung cấp.",
                        400
                    );
                }
            }

            return ApiResponse<bool>.Error(
                "Lỗi khi xóa nhà cung cấp. Vui lòng thử lại hoặc liên hệ quản trị viên.",
                500
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(
                $"Lỗi không xác định: {ex.Message}",
                500
            );
        }
    }
}
