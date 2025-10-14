using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Controllers.Admin;

public class UsersController : BaseAdminController<UserEntity, int>
{
    public UsersController(IBaseService<UserEntity, int> service) : base(service)
    {
    }
}