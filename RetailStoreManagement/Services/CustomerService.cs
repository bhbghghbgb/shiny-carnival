using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
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

    public async Task<ApiResponse<PagedList<CustomerListDto>>> GetCustomersAsync(PagedRequest request)
    {
        try
        {
            var query = _unitOfWork.Customers.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(c => c.Name.Contains(request.Search) ||
                                        c.Phone.Contains(request.Search) ||
                                        (c.Email != null && c.Email.Contains(request.Search)));
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(c => EF.Property<object>(c, request.SortBy))
                : query.OrderBy(c => EF.Property<object>(c, request.SortBy));

            var totalCount = await query.CountAsync();
            var items = await query
                .Include(c => c.Orders)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var customerDtos = _mapper.Map<List<CustomerListDto>>(items);
            var pagedList = new PagedList<CustomerListDto>(customerDtos, request.Page, request.PageSize, totalCount);

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
            var customer = await _unitOfWork.Customers.GetByIdAsync(id);
            if (customer == null)
            {
                return ApiResponse<bool>.Error("Customer not found", 404);
            }

            await _unitOfWork.Customers.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Customer deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(ex.Message);
        }
    }
}
