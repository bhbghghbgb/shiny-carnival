using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Customer;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Services;

public class CustomerService : ICustomerService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CustomerService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedList<CustomerListDto>>> GetCustomersAsync(CustomerSearchRequest request)
    {
        try
        {
            var query = _unitOfWork.Customers.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(c => c.Name.Contains(request.Search) ||
                                        c.Phone.Contains(request.Search) ||
                                        (c.Email != null && c.Email.Contains(request.Search)) ||
                                        (c.Address != null && c.Address.Contains(request.Search)));
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(c => EF.Property<object>(c, request.SortBy))
                : query.OrderBy(c => EF.Property<object>(c, request.SortBy));

            // Project to DTO and keep IQueryable
            var dtoQuery = query
                .Include(c => c.Orders)
                .Select(c => new CustomerListDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Phone = c.Phone,
                    Email = c.Email,
                    Address = c.Address,
                    LastOrderDate = c.Orders.OrderByDescending(o => o.OrderDate).FirstOrDefault() != null
                        ? c.Orders.OrderByDescending(o => o.OrderDate).First().OrderDate
                        : (DateTime?)null
                });

            // Use PagedList.CreateAsync for database-level pagination
            var pagedList = await PagedList<CustomerListDto>.CreateAsync(dtoQuery, request.Page, request.PageSize);

            return ApiResponse<PagedList<CustomerListDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<CustomerListDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<CustomerResponseDto>> GetCustomerByIdAsync(int id)
    {
        try
        {
            var customer = await _unitOfWork.Customers.GetQueryable()
                .Include(c => c.Orders)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return ApiResponse<CustomerResponseDto>.Error("Customer not found", 404);
            }

            var customerDto = _mapper.Map<CustomerResponseDto>(customer);
            return ApiResponse<CustomerResponseDto>.Success(customerDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<CustomerResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<CustomerResponseDto>> CreateCustomerAsync(CreateCustomerRequest request)
    {
        try
        {
            var customer = _mapper.Map<CustomerEntity>(request);

            await _unitOfWork.Customers.AddAsync(customer);
            await _unitOfWork.SaveChangesAsync();

            var customerDto = _mapper.Map<CustomerResponseDto>(customer);
            return ApiResponse<CustomerResponseDto>.Success(customerDto, "Customer created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<CustomerResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<CustomerResponseDto>> UpdateCustomerAsync(int id, UpdateCustomerRequest request)
    {
        try
        {
            var customer = await _unitOfWork.Customers.GetByIdAsync(id);
            if (customer == null)
            {
                return ApiResponse<CustomerResponseDto>.Error("Customer not found", 404);
            }

            _mapper.Map(request, customer);

            await _unitOfWork.Customers.UpdateAsync(customer);
            await _unitOfWork.SaveChangesAsync();

            var customerDto = _mapper.Map<CustomerResponseDto>(customer);
            return ApiResponse<CustomerResponseDto>.Success(customerDto, "Customer updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<CustomerResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<bool>> DeleteCustomerAsync(int id)
    {
        try
        {
            var customer = await _unitOfWork.Customers.GetQueryable()
                .Include(c => c.Orders)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return ApiResponse<bool>.Error("Không tìm thấy khách hàng", 404);
            }

            // Kiểm tra xem Customer có Orders không
            var orderCount = customer.Orders.Count;
            if (orderCount > 0)
            {
                return ApiResponse<bool>.Error(
                    $"Không thể xóa khách hàng này vì đang có {orderCount} đơn hàng liên quan. " +
                    "Vui lòng xóa hoặc chuyển các đơn hàng trước khi xóa khách hàng.",
                    400
                );
            }

            await _unitOfWork.Customers.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Xóa khách hàng thành công");
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
                        "Không thể xóa khách hàng này vì đang có đơn hàng liên quan. " +
                        "Vui lòng xóa hoặc chuyển các đơn hàng trước khi xóa khách hàng.",
                        400
                    );
                }
            }

            return ApiResponse<bool>.Error(
                "Lỗi khi xóa khách hàng. Vui lòng thử lại hoặc liên hệ quản trị viên.",
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
