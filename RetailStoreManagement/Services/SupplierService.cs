using AutoMapper;
using Microsoft.EntityFrameworkCore;
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
                return ApiResponse<bool>.Error("Supplier not found", 404);
            }

            // Check if supplier has products
            if (supplier.Products.Any())
            {
                return ApiResponse<bool>.Error("Cannot delete supplier that has products", 409);
            }

            await _unitOfWork.Suppliers.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Supplier deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(ex.Message);
        }
    }
}
