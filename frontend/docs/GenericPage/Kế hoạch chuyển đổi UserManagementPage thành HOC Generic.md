# Kế hoạch chuyển đổi UserManagementPage thành Higher-Order Component (HOC) Generic - Qwen CLI (RooCode)

## 1. Tổng quan

Hiện tại, `frontend/src/features/users/pages/UserManagementPage.tsx` là một trang quản lý người dùng cụ thể, chứa logic xử lý dữ liệu và UI riêng biệt. Mục tiêu của kế hoạch này là chuyển đổi thành một Higher-Order Component (HOC) có tính generic và tái sử dụng cao, có thể được sử dụng cho các trang quản lý khác trong hệ thống như Product, Category, Customer, v.v.

## 2. Mục tiêu

- Tạo một component `GenericManagementPage` có thể tái sử dụng cho các trang quản lý khác nhau
- Giảm sự trùng lặp code giữa các trang quản lý
- Tăng tính linh hoạt và dễ bảo trì cho các trang quản lý
- Tuân thủ các best practices của React và TypeScript

## 3. Phân tích hiện trạng

Hiện tại, `UserManagementPage.tsx` có các thành phần sau:
- Header với tiêu đề và nút thêm mới
- Thống kê các chỉ số (tổng số người dùng, admin, staff)
- Bộ lọc tìm kiếm và sắp xếp
- Bảng hiển thị dữ liệu người dùng
- Modal cho các hành động (thêm/sửa/xóa)

Logic xử lý dữ liệu được đặt trong hook `useUserManagementPage.ts` bao gồm:
- Lấy dữ liệu từ API
- Xử lý các hành động CRUD (Create, Read, Update, Delete)
- Quản lý trạng thái cho modal, tìm kiếm, lọc, sắp xếp

## 4. Thiết kế HOC GenericManagementPage

### 4.1. Cấu trúc props interface

```typescript
interface GenericManagementPageProps<T> {
  // Cấu hình chung
  title: string;                           // Tiêu đề trang
  entityName: string;                      // Tên entity để xử lý API endpoints
  permissions?: string[];                  // Quyền truy cập
  
  // Cấu hình hiển thị
  columns: any[];                          // Cấu hình cột cho Ant Design Table
  statisticsConfig?: StatisticsConfig;     // Cấu hình cho phần thống kê
  searchConfig?: SearchConfig;             // Cấu hình cho phần tìm kiếm
  filterConfig?: FilterConfig;             // Cấu hình cho phần lọc
  
  // Cấu hình form
  formFields: any[];                       // Cấu hình fields cho Ant Design Form
  formConfig?: FormConfig;                 // Cấu hình form (validation, layout, v.v.)
  
  // API endpoints
  apiEndpoints: {
    list: string;                          // Endpoint để lấy danh sách
    create: string;                        // Endpoint để tạo mới
    update: string;                        // Endpoint để cập nhật
    delete: string;                        // Endpoint để xóa
 };

  // Cấu hình hành động tùy chỉnh
  customActions?: CustomAction[];          // Hành động tùy chỉnh
  enableCreate?: boolean;                   // Cho phép tạo mới
  enableUpdate?: boolean;                   // Cho phép cập nhật
  enableDelete?: boolean;                   // Cho phép xóa
  
  // Callback functions
  onRowClick?: (record: T) => void;        // Callback khi click vào row
  onCreateSuccess?: (data: T) => void;      // Callback sau khi tạo thành công
  onUpdateSuccess?: (data: T) => void;      // Callback sau khi cập nhật thành công
  onDeleteSuccess?: (id: string) => void;   // Callback sau khi xóa thành công
  
  // Cấu hình UI
  headerComponent?: React.ReactNode;       // Component header tùy chỉnh
  footerComponent?: React.ReactNode;       // Component footer tùy chỉnh
  additionalControls?: React.ReactNode;    // Controls bổ sung
}
```

### 4.2. Generic types

```typescript
interface GenericManagementPageProps<T = any> {
  // ... các props như trên
}

interface StatisticsConfig {
  enabled: boolean;
  calculateFn?: (data: T[]) => any;
  statisticsItems?: {
    title: string;
    value: number;
    icon?: React.ReactNode;
    color?: string;
  }[];
}

interface SearchConfig {
  enabled: boolean;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

interface FilterConfig {
  enabled: boolean;
  filters: {
    name: string;
    type: 'select' | 'input' | 'date' | 'range';
    options?: any[];
    placeholder?: string;
  }[];
  onFilter?: (filters: any) => void;
}

interface FormConfig {
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  initialValues?: any;
}

interface CustomAction {
  name: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  visible?: (record: T) => boolean;
  disabled?: (record: T) => boolean;
  confirm?: {
    title: string;
    content: string;
  };
}
```

## 5. Cấu trúc thư mục

```
frontend/src/
├── components/
│   └── pages/
│       └── GenericManagementPage.tsx     // Component HOC chính
│       └── BaseManagementPage.tsx        // Component base nếu cần
├── features/
│   └── users/
│       └── pages/
│           └── UserManagementPage.tsx    // Component mới sử dụng HOC
```

## 6. Các bước chuyển đổi

### Bước 1: Tạo cấu trúc file và thư mục mới

1.  **Tạo thư mục mới:**
    -   Tạo `frontend/src/components/pages/`.
2.  **Di chuyển và đổi tên file:**
    -   Di chuyển `frontend/src/features/users/pages/UserManagementPage.tsx` đến `frontend/src/components/pages/`.
    -   Đổi tên file thành `GenericManagementPage.tsx`.
3.  **Tạo hook generic:**
    -   Tạo file `frontend/src/hooks/useGenericManagement.ts`. Đây sẽ là nơi chứa logic chung được tách ra từ `useUserManagementPage.ts`.

### Bước 2: Tái cấu trúc thành HOC (`GenericManagementPage.tsx`)

1.  **Tạo HOC Function:**
    -   Trong `GenericManagementPage.tsx`, tạo một function `withGenericManagement(config)` nhận vào một object `config` và trả về một React Component.
2.  **Định nghĩa Interface Cấu hình (`GenericPageConfig`):**
    -   Tạo một file `frontend/src/types/generic-page.d.ts` để định nghĩa interface này.

    ```typescript
    // frontend/src/types/generic-page.d.ts
    import { ColumnType } from 'antd/es/table';
    import { FormItemProps } from 'antd';

    export interface ApiEndpoints<T> {
        getAll: (params: any) => Promise<ApiResponse<PaginatedData<T>>>;
        create: (data: Partial<T>) => Promise<ApiResponse<T>>;
        update: (id: number | string, data: Partial<T>) => Promise<ApiResponse<T>>;
        delete: (id: number | string) => Promise<ApiResponse<any>>;
    }

    export interface FormField extends FormItemProps {
        // Có thể thêm các thuộc tính tùy chỉnh nếu cần
        // Ví dụ: componentType: 'input' | 'select' | 'datepicker';
    }

    export interface GenericPageConfig<T> {
        title: string;

        // ... các props khác như đã định nghĩa ở trên
    }
    ```

### Bước 3: Xây dựng Hook Generic (`useGenericManagement.ts`)

1.  **Di chuyển logic:** Chuyển toàn bộ logic từ `useUserManagementPage.ts` sang `useGenericManagement.ts`.
2.  **Sử dụng Generic Types:**
    -   Sửa đổi hook để sử dụng generic type `<T>`.
    -   Hook sẽ nhận vào `config: GenericPageConfig<T>`.

    ```typescript
    // frontend/src/hooks/useGenericManagement.ts
    import { useState } from 'react';
    import { Form, message } from 'antd';
    import { GenericPageConfig } from '../types/generic-page';

    export const useGenericManagement = <T extends { id: number | string }>(
        config: GenericPageConfig<T>
    ) => {
        const { apiEndpoints } = config;
        // ... (logic state, handlers, v.v.)

        // Ví dụ hàm handleDelete
        const handleDelete = async () => {
            if (deletingItem) {
                const response = await apiEndpoints.delete(deletingItem.id);
                // ... xử lý kết quả
            }
        };

        // ... các hàm khác tương tự

        return {
            // ... trả về states và handlers
        };
    };
    ```

### Bước 4: Cập nhật các Component con

-   Các component trong `frontend/src/features/users/components/` (`UserHeader`, `UserTable`, `UserModals`) cần được điều chỉnh để trở nên generic hơn hoặc nhận props một cách linh hoạt.
-   **Ví dụ:** `UserTable` sẽ nhận `columns` và `data` từ props, thay vì được hard-code cho `users`. Có thể đổi tên thành `GenericTable`. Tương tự với `GenericModalForm`.

### Bước 5: Tạo Implementation cụ thể cho User Management

1.  **Tạo file mới:** Tạo lại file `frontend/src/features/users/pages/UserManagementPage.tsx`.
2.  **Sử dụng HOC:**
    -   Import `withGenericManagement`.
    -   Định nghĩa object cấu hình `userPageConfig` theo `GenericPageConfig<User>`.
    -   Export component mới được tạo từ HOC.

    ```typescript
    // frontend/src/features/users/pages/UserManagementPage.tsx
    import { withGenericManagement } from '../../../components/pages/GenericManagementPage';
    import { userApi } from '../api/userApi';
    import { columns } from './columns'; // Định nghĩa cột cho bảng user
    import { formFields } from './formFields'; // Định nghĩa field cho form user

    const userPageConfig = {
        title: 'Quản lý Người dùng',
        entityName: 'user',
        apiEndpoints: {
            getAll: userApi.getUsers,
            create: userApi.createUser,
            update: userApi.updateUser,
            delete: userApi.deleteUser,
        },
        columns: columns,
        formFields: formFields,
    };

    // Truyền route path để HOC có thể sử dụng useLoaderData đúng cách
    export const UserManagementPage = withGenericManagement(userPageConfig, '/users');
    ```

## 7. Yêu cầu kỹ thuật

1. **TypeScript**: Sử dụng generic types để đảm bảo type safety
2. **React best practices**: Sử dụng hooks, functional components, proper state management
3. **Ant Design**: Tuân thủ best practices của Ant Design cho table, form, modal
4. **Code maintainability**: Đảm bảo code dễ đọc, dễ bảo trì và mở rộng
5. **Performance**: Tối ưu rendering và quản lý state hiệu quả

## 8. Code Examples Guide

### 8.1. Tạo GenericManagementPage.tsx

```typescript
// frontend/src/components/pages/GenericManagementPage.tsx
import { useLoaderData } from '@tanstack/react-router';
import type { GenericPageConfig } from '../../types/generic-page';
import { useGenericManagement } from '../../hooks/useGenericManagement';

// Import các component generic mới
import { GenericHeader } from '../common/GenericHeader';
import { GenericSearchFilter } from '../common/GenericSearchFilter';
import { GenericTable } from '../common/GenericTable';
import { GenericModal } from '../common/GenericModal';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';

/**
 * Higher-Order Component để tạo trang quản lý generic
 * 
 * @template T - Kiểu dữ liệu của entity, phải có thuộc tính `id`.
 * @param {GenericPageConfig<T>} config - Object cấu hình cho trang.
 * @returns Một React Component là trang quản lý hoàn chỉnh.
 */
export function withGenericManagement<T extends { id: number; name?: string; fullName?: string }>(
    config: GenericPageConfig<T>,
    routePath?: string
) {
    const GenericManagementPage = () => {
        // Sử dụng routePath được truyền vào để xác định loader data cho route cụ thể
        const loaderData = useLoaderData({ from: routePath || '/' });

        const {
            // Data
            items,
            pagination,

            // Modal states
            isModalVisible,
            isDeleteModalVisible,
            editingItem,
            deletingItem,
            form,

            // Search/Filter states
            searchText,

            // Handlers
            showModal,
            showEditModal,
            showDeleteModal,
            handleOk,
            handleDelete,
            handleCancel,
            handleDeleteCancel,
            handleSearch,
            clearFilters,
            handleTableChange,
        } = useGenericManagement<T>(config, loaderData);

        return (
            <div
                style={{
                    padding: '24px',
                    background: '#f5f5f5',
                    minHeight: '100vh',
                }}
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Header */}
                    <GenericHeader
                        title={config.title}
                        onAddItem={showModal}
                        customActions={config.customActions}
                    />

                    {/* Statistics */}
                    {config.statisticsConfig?.enabled && (
                        <GenericStatistics
                            config={config.statisticsConfig}
                            data={items}
                        />
                    )}

                    {/* Search and Filter Controls */}
                    {config.searchConfig?.enabled && (
                        <GenericSearchFilter
                            searchText={searchText}
                            onSearchChange={handleSearch}
                            onClearFilters={clearFilters}
                            searchPlaceholder={`Tìm theo ${config.entityName}...`}
                            // filterControls={...} // Có thể truyền vào các bộ lọc tùy chỉnh
                            // sortControls={...} // Có thể truyền vào các bộ sắp xếp tùy chỉnh
                        />
                    )}

                    {/* Table */}
                    <GenericTable<T>
                        columns={config.columns}
                        dataSource={items}
                        pagination={pagination}
                        onChange={handleTableChange}
                        onEditItem={showEditModal}
                        onDeleteItem={showDeleteModal}
                        entityNamePlural={config.entityName + 's'} // Cần một cách tốt hơn để pluralize
                    />
                </Space>

                {/* Modals */}
                <GenericModal<T>
                    isOpen={isModalVisible}
                    isEdit={!!editingItem}
                    editingItem={editingItem}
                    form={form}
                    formFields={config.formFields}
                    formConfig={config.formConfig}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    loading={false} // Cần thêm state loading vào hook
                />

                <DeleteConfirmationModal
                    isOpen={isDeleteModalVisible}
                    itemName={deletingItem?.name || deletingItem?.fullName || 'item'}
                    onOk={handleDelete}
                    onCancel={handleDeleteCancel}
                    loading={false} // Cần thêm state loading vào hook
                />
            </div>
        );
    };

    return GenericManagementPage;
}
```

### 8.2. Tạo useGenericManagement.ts

```typescript
// frontend/src/hooks/useGenericManagement.ts
import { Form, message } from 'antd';
import type { GenericPageConfig } from '../types/generic-page';
import { useSearch, useNavigate } from '@tanstack/react-router';

/**
 * Custom hook để quản lý logic chung cho các trang quản lý
 * 
 * @template T - Kiểu dữ liệu của entity, phải có thuộc tính `id`.
 * @param {GenericPageConfig<T>} config - Object cấu hình cho trang.
 * @param {any} loaderData - Dữ liệu được truyền từ loader của route.
 * @returns Object chứa các states và handlers cần thiết cho trang quản lý.
 */
export const useGenericManagement = <T extends { id: number }>(
    config: GenericPageConfig<T>,
    loaderData: any
) => {
    const navigate = useNavigate();
    const search = useSearch();

    // States
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [deletingItem, setDeletingItem] = useState<T | null>(null);
    const [form] = Form.useForm();

    // Search, Filter, Sort states
    const [searchText, setSearchText] = useState(search.search || '');
    const [currentPage, setCurrentPage] = useState(search.page || 1);
    const [pageSize, setPageSize] = useState(search.pageSize || 20);

    // Data từ loader
    const items = loaderData?.data?.items || [];
    const pagination = {
        current: currentPage,
        pageSize: pageSize,
        total: loaderData?.data?.totalCount || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} của ${total} ${config.entityName}`,
    };

    // Handlers
    const showModal = () => {
        setEditingItem(null);
        setIsModalVisible(true);
        setTimeout(() => {
            form.resetFields();
        }, 0);
    };

    const showEditModal = (item: T) => {
        setEditingItem(item);
        setIsModalVisible(true);
        form.setFieldsValue(item);
    };

    const showDeleteModal = (item: T) => {
        setDeletingItem(item);
        setIsDeleteModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form Values: ', values);

            if (editingItem) {
                // Update item
                const response = await config.apiEndpoints.update(editingItem.id, values);
                if (!response.isError && response.data) {
                    message.success(`Cập nhật ${config.entityName} thành công!`);
                    // Refresh data by navigating to current page
                    navigate({ search: (prev) => ({ ...prev }) });
                } else {
                    message.error(
                        response.message || `Không thể cập nhật ${config.entityName}`
                    );
                }
            } else {
                // Add new item
                const response = await config.apiEndpoints.create(values);
                if (!response.isError && response.data) {
                    message.success(`Thêm ${config.entityName} thành công!`);
                    // Refresh data by navigating to current page
                    navigate({ search: (prev) => ({ ...prev }) });
                } else {
                    message.error(
                        response.message || `Không thể tạo ${config.entityName} mới`
                    );
                }
            }
            form.resetFields();
            setIsModalVisible(false);
        } catch (error: any) {
            if (error.errorFields) {
                // Form validation errors
                console.log('Validate Failed:', error);
            } else {
                // API errors
                message.error(error.message || 'Có lỗi xảy ra');
                console.error('API Error:', error);
            }
        }
    };

    const handleDelete = async () => {
        if (deletingItem) {
            try {
                const response = await config.apiEndpoints.delete(deletingItem.id);
                if (!response.isError && response.data) {
                    message.success(`Xóa ${config.entityName} thành công!`);
                    // Refresh data by navigating to current page
                    navigate({ search: (prev) => ({ ...prev }) });
                    setIsDeleteModalVisible(false);
                    setDeletingItem(null);
                } else {
                    message.error(
                        response.message || `Không thể xóa ${config.entityName}`
                    );
                }
            } catch (error: any) {
                message.error(
                    error.message || `Có lỗi xảy ra khi xóa ${config.entityName}`
                );
                console.error('Delete error:', error);
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setDeletingItem(null);
    };

    // Search, Filter, Sort handlers
    const handleSearch = (value: string) => {
        setSearchText(value);
        navigate({
            search: (prev) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        });
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        
        // Handle sorting if needed
        if (sorter.field && sorter.order) {
            navigate({
                search: (prev) => ({
                    ...prev,
                    sortBy: sorter.field,
                    sortOrder: sorter.order,
                    page: pagination.current,
                }),
            });
        } else {
            navigate({
                search: (prev) => ({
                    ...prev,
                    page: pagination.current,
                }),
            });
        }
    };

    const clearFilters = () => {
        setSearchText('');
        navigate({
            search: (prev) => ({
                ...prev,
                search: undefined,
                page: 1,
            }),
        });
    };

    return {
        // Data
        items,
        pagination,

        // Modal states
        isModalVisible,
        isDeleteModalVisible,
        editingItem,
        deletingItem,
        form,

        // Search/Filter states
        searchText,

        // Handlers
        showModal,
        showEditModal,
        showDeleteModal,
        handleOk,
        handleDelete,
        handleCancel,
        handleDeleteCancel,
        handleSearch,
        clearFilters,
        handleTableChange,
    };
};
```

### 8.3. Tạo Generic Components

```typescript
// frontend/src/components/common/GenericHeader.tsx
import { Button, Card, Row, Col, Space, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface GenericHeaderProps {
    title: string;
    onAddItem: () => void;
    customActions?: React.ReactNode;
}

export const GenericHeader = ({
    title,
    onAddItem,
    customActions,
}: GenericHeaderProps) => {
    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space direction="vertical" size="small">
                        <Title
                            level={2}
                            style={{ margin: 0, color: '#1890ff' }}
                        >
                            {title}
                        </Title>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        {customActions}
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={onAddItem}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                            }}
                        >
                            Thêm
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}
```

```typescript
// frontend/src/components/common/GenericTable.tsx
import { Table } from 'antd';
import type { TableProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// Mở rộng TableProps của Ant Design để bao gồm các props tùy chỉnh
interface GenericTableProps<T> extends TableProps<T> {
    onEditItem: (item: T) => void;
    onDeleteItem: (item: T) => void;
    entityNamePlural: string;
}

/**
 * Generic Table component cho các trang quản lý
 * 
 * @template T - Kiểu dữ liệu của entity
 * @param {GenericTableProps<T>} props - Props cho component
 * @returns React Component là bảng hiển thị dữ liệu
 */
export const GenericTable = <T extends { id: number | string }>({
    columns,
    dataSource,
    pagination,
    loading,
    onChange,
    onEditItem,
    onDeleteItem,
    entityNamePlural,
}: GenericTableProps<T>) => {
    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={pagination}
            loading={loading}
            onChange={onChange}
            style={{
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        />
    );
};
```

### 8.4. Tạo Implementation cụ thể cho UserManagementPage

```typescript
// frontend/src/features/users/pages/UserManagementPage.tsx
import { withGenericManagement } from '../../../components/pages/GenericManagementPage';
import { userApi } from '../api/userApi';
import type { UserEntity } from '../types/entity';
import type { GenericPageConfig } from '../../../types/generic-page';

// Cấu hình chi tiết cho trang quản lý người dùng.
const userPageConfig: GenericPageConfig<UserEntity> = {
    title: 'Quản lý Người dùng',
    entityName: 'user',
    apiEndpoints: {
        getAll: userApi.getUsers,
        create: userApi.createUser,
        update: userApi.updateUser,
        delete: userApi.deleteUser,
    },
    columns: [
        // Cấu hình cột cho bảng người dùng
        {
            title: 'Người dùng',
            key: 'user',
            render: (record: UserEntity) => (
                <Space>
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor:
                                record.role === 0 ? '#faad14' : '#52c41a',
                            border: '2px solid #fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>
                            {record.fullName}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            @{record.username}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: number) => (
                <Tag
                    color={role === 0 ? 'gold' : 'green'}
                    icon={role === 0 ? <CrownOutlined /> : <UserOutlined />}
                    style={{ borderRadius: '12px', padding: '4px 12px' }}
                >
                    {role === 0 ? 'Admin' : 'Staff'}
                </Tag>
            ),
        },
        // ... các cột khác
    ],
    formFields: [
        // Cấu hình trường form cho người dùng
        {
            name: 'username',
            label: 'Tên đăng nhập',
            rules: [{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }],
            component: <Input />,
        },
        {
            name: 'fullName',
            label: 'Họ và tên',
            rules: [{ required: true, message: 'Vui lòng nhập họ và tên!' }],
            component: <Input />,
        },
        // ... các trường form khác
    ],
    statisticsConfig: {
        enabled: true,
        statisticsItems: [
            { title: "Tổng người dùng", value: 0, icon: <TeamOutlined /> },
            { title: "Quản trị viên", value: 0, icon: <CrownOutlined /> },
            { title: "Nhân viên", value: 0, icon: <UserOutlined /> }
        ]
    },
    searchConfig: {
        enabled: true,
        placeholder: "Tìm theo tên hoặc username..."
    }
};

// Tạo và export component trang quản lý người dùng.
export const UserManagementPage = withGenericManagement(userPageConfig);
```

## 9. Template cho các trang quản lý khác

Sau khi hoàn thành HOC, việc tạo các trang quản lý khác sẽ đơn giản như:

```typescript
// ProductManagementPage.tsx
const ProductManagementPage = () => {
  const productManagementConfig = {
    title: "Quản lý sản phẩm",
    entityName: "product",
    columns: productColumns,
    formFields: productFormFields,
    apiEndpoints: {
      list: "/api/products",
      create: "/api/products",
      update: "/api/products/:id",
      delete: "/api/products/:id"
    }
  };

  return <GenericManagementPage {...productManagementConfig} />;
};
```

## 10. Các điểm cần lưu ý khi chuyển đổi

1. **Xử lý API**: Đảm bảo generic API handlers có thể xử lý các loại dữ liệu khác nhau
2. **Form validation**: Cấu hình validation linh hoạt cho từng loại entity
3. **Phân quyền**: Hỗ trợ kiểm tra quyền truy cập cho các hành động khác nhau
4. **Internationalization**: Cân nhắc hỗ trợ đa ngôn ngữ trong tương lai
5. **Testing**: Viết unit tests cho các component generic