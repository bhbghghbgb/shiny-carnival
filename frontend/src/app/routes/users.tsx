import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { UserManagementPage } from '../../features/users/pages/UserManagementPage'
import { userApi } from '../../features/users/api/userApi'
import { PendingComponent } from '../../components/feedback/PendingComponent'
import { ErrorComponent } from '../../components/feedback/ErrorComponent'
import { UserManagementMockPage } from '../../features/users/pages/UserManagementMockPage'

// Schema để xác thực search params cho trang sản phẩm
const userSearchSchema = z.object({
    page: z.number().catch(1), // Mặc định là trang 1 nếu không có
    pageSize: z.number().catch(10), // Mặc định 10 sản phẩm mỗi trang
    search: z.string().optional(),
    // Thêm các filter khác nếu cần
})

// Suy ra kiểu từ schema để sử dụng trong loader
type TUserSearch = z.infer<typeof userSearchSchema>

export const Route = createFileRoute('/users')({
    // validateSearch: userSearchSchema,
    // loaderDeps: ({ search }: { search: TUserSearch }) => search,
    // loader: ({ deps }: { deps: TUserSearch }) => userApi.getUsers(deps),
    // Todo: Sử dụng component UserManagementPage khi có API
    component: UserManagementMockPage,
    pendingComponent: PendingComponent,
    errorComponent: ErrorComponent,
})
