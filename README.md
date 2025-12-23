# TapHoaNho - Retail Store Management System

> Hệ thống Quản lý Cửa hàng Bán lẻ - Full-stack Web Application

## Mục lục

- [Tổng quan](#tổng-quan)
- [Tech Stack](#tech-stack)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
  - [Backend Architecture](#backend-architecture)
  - [Frontend Architecture](#frontend-architecture)
- [Call Graph - API Endpoints](#call-graph---api-endpoints)
  - [Authentication Flow](#authentication-flow)
  - [Order Endpoints](#order-endpoints)
  - [Inventory Endpoints](#inventory-endpoints)
- [Design Patterns](#design-patterns)
  - [Backend Patterns](#backend-patterns)
  - [Frontend Patterns](#frontend-patterns)
- [Database Schema](#database-schema)
- [Chức năng](#chức-năng)

---

## Tổng quan

**TapHoaNho** là hệ thống quản lý cửa hàng bán lẻ toàn diện, được xây dựng với kiến trúc modern full-stack. Hệ thống hỗ trợ các nghiệp vụ thường ngày bao gồm: quản lý khách hàng, sản phẩm, nhà cung cấp, khuyến mãi, đơn hàng, thanh toán và tài khoản nhân viên.

---

## Tech Stack

### Backend
| Công nghệ | Mục đích |
|-----------|----------|
| **ASP.NET Core 9** | Web API Framework |
| **Entity Framework Core** | ORM - Database Access |
| **PostgreSQL** | Relational Database |
| **JWT + HttpOnly Cookies** | Authentication & Authorization |
| **AutoMapper** | Object Mapping |
| **FluentValidation** | Request Validation |

### Frontend
| Công nghệ | Mục đích |
|-----------|----------|
| **React 19** | UI Library |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool |
| **TanStack Router** | Type-safe Routing |
| **TanStack Query** | Server State Management |
| **Zustand** | Client State Management |
| **Ant Design** | UI Component Library |
| **Axios** | HTTP Client |

---

## Kiến trúc hệ thống

### Backend Architecture

```mermaid
flowchart TB
    subgraph Presentation["Presentation Layer"]
        AuthCtrl["AuthController"]
        AdminCtrl["Admin Controllers"]
        PublicCtrl["Public Controllers"]
    end

    subgraph Business["Business Logic Layer"]
        AuthSvc["AuthService"]
        BaseSvc["BaseService&lt;T&gt;"]
        OrderSvc["OrderService"]
        InvSvc["InventoryService"]
        UserSvc["UserService"]
    end

    subgraph DataAccess["Data Access Layer"]
        Repo["Repository&lt;T&gt;"]
        UoW["UnitOfWork"]
    end

    subgraph Infrastructure["Infrastructure"]
        DbCtx["ApplicationDbContext"]
        JWT["JWT Token Handler"]
    end

    subgraph Database["Database"]
        PG[(PostgreSQL)]
    end

    AuthCtrl --> AuthSvc
    AdminCtrl --> BaseSvc
    AdminCtrl --> OrderSvc
    AdminCtrl --> InvSvc
    PublicCtrl --> BaseSvc

    AuthSvc --> UoW
    BaseSvc --> Repo
    OrderSvc --> UoW
    InvSvc --> UoW
    UserSvc --> UoW

    Repo --> DbCtx
    UoW --> DbCtx
    AuthSvc --> JWT

    DbCtx --> PG
```

#### Backend Layer Description

| Layer | Mô tả | Components |
|-------|-------|------------|
| **Presentation** | Xử lý HTTP requests/responses | Controllers (Auth, Admin/*, Public/*) |
| **Business Logic** | Business rules & validation | Services (BaseService, OrderService, etc.) |
| **Data Access** | Database operations | Repository Pattern, Unit of Work |
| **Infrastructure** | Cross-cutting concerns | DbContext, JWT, AutoMapper |

---

### Frontend Architecture

```mermaid
flowchart TB
    subgraph UILayer["UI Layer - React Components"]
        direction TB
        GP["GenericPage"]
        GT["GenericTable"]
        GF["GenericForm"]
        PC["PageConfig"]
    end

    subgraph HookLayer["Hook Layer - Custom Hooks"]
        direction TB
        UAL["useApiList"]
        UAP["useApiPaginated"]
        UAC["useApiCreate"]
        UAU["useApiUpdate"]
        UAD["useApiDelete"]
        PWR["usePaginationWithRouter"]
    end

    subgraph ServiceLayer["Service Layer - API Services"]
        direction TB
        BAS["BaseApiService&lt;T&gt;"]
        subgraph Methods["Methods"]
            getAll["getAll()"]
            getPaginated["getPaginated()"]
            getById["getById()"]
            create["create()"]
            update["update()"]
            delete["delete()"]
        end
    end

    subgraph State["State Management"]
        TQ["TanStack Query Cache"]
        ZS["Zustand Store"]
    end

    subgraph HTTP["HTTP Layer"]
        AX["Axios Client"]
        INT["Interceptors"]
    end

    GP --> GT
    GP --> GF
    PC --> GP

    GT --> UAP
    GT --> PWR
    GF --> UAC
    GF --> UAU

    UAL --> BAS
    UAP --> BAS
    UAC --> BAS
    UAU --> BAS
    UAD --> BAS
    PWR --> UAP

    BAS --> Methods
    Methods --> AX
    AX --> INT

    UAL --> TQ
    UAP --> TQ
    ZS --> UILayer
```

#### Frontend 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI LAYER                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              GenericPage (Container)                       │ │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │ │
│  │   │GenericTable │  │ GenericForm │  │ GenericActions  │  │ │
│  │   │  - columns  │  │  - fields   │  │  - CRUD buttons │  │ │
│  │   │  - toolbar  │  │  - validate │  │  - custom acts  │  │ │
│  │   └─────────────┘  └─────────────┘  └─────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                    PageConfig (entity-specific)                  │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                        HOOK LAYER                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Universal Hooks (Factory Pattern)             │  │
│  │   ┌────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │   │ useApiList │  │useApiPaginated│  │useApiCreate     │  │  │
│  │   │ useApiDetail│ │useApiUpdate   │  │useApiDelete     │  │  │
│  │   └────────────┘  └──────────────┘  └─────────────────┘  │  │
│  │                                                            │  │
│  │   ┌────────────────────────────────────────────────────┐ │  │
│  │   │         usePaginationWithRouter                     │ │  │
│  │   │  - URL sync  - Pagination  - Search  - Sort        │ │  │
│  │   └────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                      SERVICE LAYER                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           BaseApiService<TData, TCreate, TUpdate>          │  │
│  │   ┌──────────────────────────────────────────────────┐   │  │
│  │   │  getAll(params?)     │  getPaginated(params?)     │   │  │
│  │   │  getById(id)         │  create(data)              │   │  │
│  │   │  update(id, data)    │  patch(id, data)           │   │  │
│  │   │  delete(id)          │  custom(method, path, ...) │   │  │
│  │   └──────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Call Graph - API Endpoints

### Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant UnitOfWork
    participant JwtHandler
    participant Database

    Note over Client,Database: Login Flow
    Client->>AuthController: POST /api/auth/login
    AuthController->>AuthService: LoginAsync(request)
    AuthService->>UnitOfWork: Users.GetQueryable()
    UnitOfWork->>Database: SELECT user WHERE username
    Database-->>UnitOfWork: User entity
    UnitOfWork-->>AuthService: User
    AuthService->>AuthService: BCrypt.Verify(password)
    AuthService->>JwtHandler: GenerateJwtToken(user)
    JwtHandler-->>AuthService: Access Token
    AuthService->>UnitOfWork: UserRefreshTokens.AddAsync()
    UnitOfWork->>Database: INSERT refresh_token
    AuthService-->>AuthController: LoginResponse
    AuthController->>AuthController: SetTokenCookies()
    AuthController-->>Client: ApiResponse + HttpOnly Cookies

    Note over Client,Database: Refresh Token Flow
    Client->>AuthController: POST /api/auth/refresh
    AuthController->>AuthController: Read cookies
    AuthController->>AuthService: RefreshTokenAsync(request)
    AuthService->>UnitOfWork: UserRefreshTokens.GetQueryable()
    UnitOfWork->>Database: SELECT token WHERE refresh_token
    Database-->>UnitOfWork: RefreshToken + User
    AuthService->>AuthService: Validate token expiry
    AuthService->>JwtHandler: GenerateJwtToken(user)
    JwtHandler-->>AuthService: New Access Token
    AuthService-->>AuthController: LoginResponse
    AuthController->>AuthController: SetTokenCookies()
    AuthController-->>Client: New tokens in cookies

    Note over Client,Database: Logout Flow
    Client->>AuthController: POST /api/auth/logout
    AuthController->>AuthService: LogoutAsync(request)
    AuthService->>UnitOfWork: Revoke refresh token
    UnitOfWork->>Database: UPDATE set is_revoked = true
    AuthController->>AuthController: ClearTokenCookies()
    AuthController-->>Client: Success + Clear cookies
```

---

### Order Endpoints

```mermaid
sequenceDiagram
    participant Client
    participant OrdersController
    participant OrderService
    participant UnitOfWork
    participant Database

    Note over Client,Database: GET /api/admin/orders - List Orders
    Client->>OrdersController: GET /api/admin/orders?page=1&search=...
    OrdersController->>OrderService: GetOrdersAsync(request)
    OrderService->>UnitOfWork: Orders.GetQueryable()
    OrderService->>OrderService: Apply filters (search, status, dates)
    OrderService->>OrderService: Apply sorting
    OrderService->>UnitOfWork: Include(Customer, User)
    UnitOfWork->>Database: SELECT with pagination
    Database-->>OrderService: PagedList<OrderListDto>
    OrderService-->>OrdersController: ApiResponse<PagedList>
    OrdersController-->>Client: 200 OK + data

    Note over Client,Database: POST /api/admin/orders - Create Order
    Client->>OrdersController: POST /api/admin/orders
    OrdersController->>OrdersController: Get userId from JWT claims
    OrdersController->>OrderService: CreateOrderAsync(request, userId)
    OrderService->>UnitOfWork: Validate customer exists
    OrderService->>UnitOfWork: Validate products & stock
    alt PromoCode provided
        OrderService->>UnitOfWork: Get promotion
        OrderService->>OrderService: ValidatePromotion()
        OrderService->>OrderService: CalculateDiscount()
    end
    OrderService->>OrderService: Calculate totals
    OrderService->>UnitOfWork: Orders.AddAsync(order)
    OrderService->>UnitOfWork: OrderItems.AddAsync(items)
    OrderService->>UnitOfWork: SaveChangesAsync()
    OrderService-->>OrdersController: ApiResponse<OrderDetailsDto>
    OrdersController-->>Client: 200 OK + created order

    Note over Client,Database: PATCH /api/admin/orders/{id}/status
    Client->>OrdersController: PATCH /api/admin/orders/1/status
    OrdersController->>OrderService: UpdateOrderStatusAsync(id, request)
    OrderService->>UnitOfWork: Get order with items & inventory
    alt Pending → Paid
        OrderService->>OrderService: Validate stock
        loop Each OrderItem
            OrderService->>UnitOfWork: Decrease inventory
        end
        OrderService->>UnitOfWork: Create Payment record
    else Paid → Canceled
        loop Each OrderItem
            OrderService->>UnitOfWork: Restore inventory
        end
        OrderService->>UnitOfWork: Delete Payment
        OrderService->>UnitOfWork: Decrement promo usedCount
    end
    OrderService->>UnitOfWork: Update order status
    OrderService->>UnitOfWork: SaveChangesAsync()
    OrderService-->>OrdersController: ApiResponse<OrderResponseDto>
    OrdersController-->>Client: 200 OK + updated order
```

---

### Inventory Endpoints

```mermaid
sequenceDiagram
    participant Client
    participant InventoryController
    participant InventoryService
    participant UnitOfWork
    participant Database

    Note over Client,Database: GET /api/admin/inventory - List Inventory
    Client->>InventoryController: GET /api/admin/inventory?page=1
    InventoryController->>InventoryService: GetInventoryAsync(request)
    InventoryService->>UnitOfWork: Inventory.GetQueryable()
    InventoryService->>InventoryService: Apply filters (search, quantity range)
    InventoryService->>InventoryService: Apply sorting
    InventoryService->>UnitOfWork: Include(Product)
    InventoryService->>InventoryService: Project to DTO with status
    UnitOfWork->>Database: SELECT with pagination
    Database-->>InventoryService: PagedList<InventoryResponseDto>
    InventoryService-->>InventoryController: ApiResponse<PagedList>
    InventoryController-->>Client: 200 OK + inventory list

    Note over Client,Database: PATCH /api/admin/inventory/{productId}
    Client->>InventoryController: PATCH /api/admin/inventory/1
    InventoryController->>InventoryController: Get userId from JWT claims
    InventoryController->>InventoryService: UpdateInventoryAsync(productId, request, userId)
    InventoryService->>UnitOfWork: Get inventory by productId
    InventoryService->>InventoryService: Calculate new quantity
    alt New quantity < 0
        InventoryService-->>InventoryController: Error: Insufficient quantity
    end
    InventoryService->>UnitOfWork: Update inventory
    InventoryService->>UnitOfWork: Log InventoryHistory
    InventoryService->>UnitOfWork: SaveChangesAsync()
    InventoryService-->>InventoryController: ApiResponse<InventoryResponseDto>
    InventoryController-->>Client: 200 OK + updated inventory

    Note over Client,Database: GET /api/admin/inventory/low-stock
    Client->>InventoryController: GET /api/admin/inventory/low-stock
    InventoryController->>InventoryService: GetLowStockAlertsAsync()
    InventoryService->>UnitOfWork: Inventory.GetQueryable()
    InventoryService->>InventoryService: Filter quantity < threshold
    UnitOfWork->>Database: SELECT low stock items
    Database-->>InventoryService: List<LowStockAlertDto>
    InventoryService-->>InventoryController: ApiResponse<List>
    InventoryController-->>Client: 200 OK + alerts
```

---

## Design Patterns

### Backend Patterns

#### 1. Repository Pattern

```mermaid
classDiagram
    class IRepository~TEntity, TKey~ {
        <<interface>>
        +GetByIdAsync(TKey id) TEntity
        +GetAllAsync() IEnumerable~TEntity~
        +GetPagedAsync(PagedRequest) IPagedList~TEntity~
        +AddAsync(TEntity) TEntity
        +UpdateAsync(TEntity) void
        +DeleteAsync(TKey id) void
        +SoftDeleteAsync(TKey id) void
        +GetQueryable() IQueryable~TEntity~
    }

    class Repository~TEntity, TKey~ {
        #DbContext _context
        #DbSet~TEntity~ _dbSet
        +GetByIdAsync(TKey id)
        +GetAllAsync()
        +GetPagedAsync(PagedRequest)
        +AddAsync(TEntity)
        +UpdateAsync(TEntity)
        #ApplySearch(IQueryable, string)
        #ApplySorting(IQueryable, string, bool)
    }

    class BaseEntity~TKey~ {
        +TKey Id
        +DateTime CreatedAt
        +DateTime? UpdatedAt
        +DateTime? DeletedAt
    }

    IRepository <|.. Repository : implements
    Repository --> BaseEntity : operates on
```

**Mô tả:**
- **Generic Repository** cung cấp các CRUD operations chuẩn
- Hỗ trợ pagination, search, sorting tự động
- Soft delete với `DeletedAt` timestamp
- Override `ApplySearch()` cho entity-specific search logic

---

#### 2. Service Layer Pattern

```mermaid
classDiagram
    class IBaseService~TEntity, TKey~ {
        <<interface>>
        +GetByIdAsync(TKey) ApiResponse~TEntity~
        +GetPagedAsync(PagedRequest) ApiResponse~IPagedList~
        +CreateAsync(TEntity) ApiResponse~TEntity~
        +UpdateAsync(TKey, TEntity) ApiResponse~TEntity~
        +DeleteAsync(TKey) ApiResponse~bool~
    }

    class BaseService~TEntity, TKey~ {
        #IRepository~TEntity, TKey~ _repository
        +GetByIdAsync(TKey id)
        +GetPagedAsync(PagedRequest)
        +CreateAsync(TEntity)
        +UpdateAsync(TKey, TEntity)
        +DeleteAsync(TKey)
    }

    class OrderService {
        -IUnitOfWork _unitOfWork
        -IMapper _mapper
        +GetOrdersAsync(OrderSearchRequest)
        +CreateOrderAsync(CreateOrderRequest, userId)
        +UpdateOrderStatusAsync(id, request)
        -ValidatePromotion(promotion, total)
        -CalculateDiscount(promotion, total)
    }

    class InventoryService {
        -IUnitOfWork _unitOfWork
        -IMapper _mapper
        +GetInventoryAsync(request)
        +UpdateInventoryAsync(productId, request, userId)
        +GetLowStockAlertsAsync()
        +GetInventoryHistoryAsync(productId, request)
    }

    IBaseService <|.. BaseService : implements
    BaseService <|-- OrderService : extends
    BaseService <|-- InventoryService : extends
```

**Mô tả:**
- **BaseService** xử lý CRUD operations cơ bản
- **Domain Services** (OrderService, InventoryService) xử lý business logic phức tạp
- Tất cả response được wrap trong `ApiResponse<T>` để chuẩn hóa

---

#### 3. Unit of Work Pattern

```mermaid
classDiagram
    class IUnitOfWork {
        <<interface>>
        +IRepository~User~ Users
        +IRepository~Product~ Products
        +IRepository~Order~ Orders
        +IRepository~Inventory~ Inventory
        +IRepository~InventoryHistory~ InventoryHistories
        +IRepository~Payment~ Payments
        +IRepository~Promotion~ Promotions
        +SaveChangesAsync() int
        +BeginTransactionAsync()
        +CommitAsync()
        +RollbackAsync()
    }

    class UnitOfWork {
        -ApplicationDbContext _context
        -Dictionary~Type, object~ _repositories
        +Users: IRepository~User~
        +Products: IRepository~Product~
        +Orders: IRepository~Order~
        +SaveChangesAsync()
    }

    class ApplicationDbContext {
        +DbSet~User~ Users
        +DbSet~Product~ Products
        +DbSet~Order~ Orders
        +OnModelCreating()
    }

    IUnitOfWork <|.. UnitOfWork : implements
    UnitOfWork --> ApplicationDbContext : uses
```

**Mô tả:**
- Quản lý transaction across multiple repositories
- Đảm bảo data consistency
- Lazy initialization của repositories

---

### Frontend Patterns

#### 1. GenericPage Pattern (Configuration-Driven)

```mermaid
classDiagram
    class GenericPageConfig~TData, TCreate, TUpdate~ {
        +entity: EntityConfig
        +apiService: BaseApiService
        +table: TableConfig
        +form: FormConfig
        +features: FeatureFlags
        +customActions: CustomAction[]
    }

    class EntityConfig {
        +name: string
        +displayName: string
        +displayNamePlural: string
    }

    class TableConfig~TData~ {
        +columns: GenericColumnType[]
        +rowKey: keyof TData
        +defaultSortBy: string
        +defaultPageSize: number
        +pageSizeOptions: number[]
    }

    class FormConfig~TFormData~ {
        +fields: FormFieldConfig[]
        +layout: horizontal|vertical
        +initialValues: Partial~TFormData~
    }

    class GenericPage~TData~ {
        +config: GenericPageConfig
        +routeApi: RouteApi
        +formMode: modal|drawer
        +slots: SlotConfig
        -createModalVisible: boolean
        -editingId: number|null
        +render()
    }

    class GenericTable~TData~ {
        +config: GenericPageConfig
        +onCreateClick()
        +onEditClick(record)
        -columns: computed
        -toolbar: computed
    }

    class GenericForm~TFormData~ {
        +config: FormConfig
        +onSubmit(values)
        +onCancel()
        +loading: boolean
        -renderField(fieldConfig)
    }

    GenericPageConfig --> EntityConfig
    GenericPageConfig --> TableConfig
    GenericPageConfig --> FormConfig
    GenericPage --> GenericPageConfig : uses
    GenericPage --> GenericTable : contains
    GenericPage --> GenericForm : contains
```

**Mô tả:**
- **Configuration-Driven**: Mỗi entity chỉ cần định nghĩa config
- **DRY Principle**: GenericPage render dựa trên config
- **Slot Pattern**: Cho phép customize header, statistics, filters
- **Type-safe**: Full TypeScript generics support

---

#### 2. Universal Hook Pattern (Factory)

```mermaid
classDiagram
    class UseApiConfig~TData~ {
        +apiService: BaseApiService
        +entity: string
        +params: QueryParams
        +options: UseQueryOptions
    }

    class useApiList~TData~ {
        +config: UseApiConfig
        +returns: UseQueryResult~TData[]~
    }

    class useApiPaginated~TData~ {
        +config: UseApiConfig
        +returns: UseQueryResult~PagedList~
    }

    class useApiDetail~TData~ {
        +apiService: BaseApiService
        +entity: string
        +id: string|number
        +returns: UseQueryResult~TData~
    }

    class useApiCreate~TData, TCreate~ {
        +apiService: BaseApiService
        +entity: string
        +invalidateQueries: string[]
        +returns: UseMutationResult
    }

    class useApiUpdate~TData, TUpdate~ {
        +apiService: BaseApiService
        +entity: string
        +returns: UseMutationResult
    }

    class useApiDelete~TData~ {
        +apiService: BaseApiService
        +entity: string
        +returns: UseMutationResult
    }

    class usePaginationWithRouter~TData~ {
        +apiService: BaseApiService
        +entity: string
        +routeApi: RouteApi
        +returns: PaginationResult
        -handlePageChange(page, size)
        -handleSearch(text)
        -handleSort(field, desc)
        -handleFilterChange(filters)
    }

    UseApiConfig <-- useApiList : uses
    UseApiConfig <-- useApiPaginated : uses
    useApiPaginated <-- usePaginationWithRouter : extends
```

**Mô tả:**
- **Factory Pattern**: Tạo hooks từ config
- **Automatic Cache Management**: TanStack Query handles caching
- **URL Sync**: `usePaginationWithRouter` sync state với URL
- **Invalidation**: Tự động invalidate related queries

---

#### 3. BaseApiService Pattern

```mermaid
classDiagram
    class ApiServiceInterface~TData, TCreate, TUpdate~ {
        <<interface>>
        +getAll(params?) Promise~TData[]~
        +getPaginated(params?) Promise~PagedList~
        +getById(id) Promise~TData~
        +create(data) Promise~TData~
        +update(id, data) Promise~TData~
        +patch(id, data) Promise~TData~
        +delete(id) Promise~void~
    }

    class BaseApiService~TData, TCreate, TUpdate~ {
        #endpoint: string
        #axios: AxiosInstance
        +getAll(params?)
        +getPaginated(params?)
        +getById(id)
        +create(data)
        +update(id, data)
        +patch(id, data)
        +delete(id)
        +custom(method, path, data, params)
        -toPascalCaseParams(obj)
    }

    class ProductApiService {
        +endpoint: /api/admin/products
    }

    class OrderApiService {
        +endpoint: /api/admin/orders
        +updateStatus(id, status)
        +addItem(orderId, item)
    }

    ApiServiceInterface <|.. BaseApiService : implements
    BaseApiService <|-- ProductApiService : extends
    BaseApiService <|-- OrderApiService : extends
```

**Mô tả:**
- **Generic Service**: BaseApiService xử lý CRUD operations
- **Param Conversion**: Tự động convert camelCase → PascalCase
- **Response Unwrap**: Tự động unwrap ApiResponse wrapper
- **Custom Methods**: `custom()` cho endpoints đặc biệt

---

## Database Schema

```mermaid
erDiagram
    users ||--o{ orders : creates
    users ||--o{ user_refresh_tokens : has
    users ||--o{ inventory_history : logs

    customers ||--o{ orders : places

    categories ||--o{ products : contains
    suppliers ||--o{ products : provides

    products ||--|| inventory : has
    products ||--o{ order_items : appears_in
    products ||--o{ inventory_history : tracked_by

    orders ||--o{ order_items : contains
    orders ||--o{ payments : has
    orders }o--|| promotions : applies

    users {
        int id PK
        string username UK
        string password
        string full_name
        int role
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    customers {
        int id PK
        string name
        string phone
        string email
        string address
        datetime created_at
    }

    products {
        int id PK
        string product_name
        string barcode UK
        decimal price
        string unit
        int category_id FK
        int supplier_id FK
        datetime created_at
    }

    inventory {
        int id PK
        int product_id FK UK
        int quantity
        datetime updated_at
    }

    orders {
        int id PK
        int customer_id FK
        int user_id FK
        int promo_id FK
        datetime order_date
        string status
        decimal total_amount
        decimal discount_amount
    }

    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
        decimal subtotal
    }

    payments {
        int id PK
        int order_id FK
        decimal amount
        string payment_method
        datetime payment_date
    }

    promotions {
        int id PK
        string promo_code UK
        string description
        string discount_type
        decimal discount_value
        decimal min_order_amount
        date start_date
        date end_date
        int usage_limit
        int used_count
        string status
    }
```

---

## Chức năng

### Core Features

| Module | Chức năng | Admin | Staff |
|--------|-----------|:-----:|:-----:|
| **Authentication** | Login, Logout, Token Refresh | ✅ | ✅ |
| **Users** | CRUD người dùng | ✅ | ❌ |
| **Customers** | CRUD khách hàng | ✅ | ✅ |
| **Products** | CRUD sản phẩm | ✅ | ✅ |
| **Categories** | CRUD danh mục | ✅ | ✅ |
| **Suppliers** | CRUD nhà cung cấp | ✅ | ✅ |
| **Inventory** | Quản lý tồn kho, cảnh báo low stock | ✅ | ✅ |
| **Orders** | Tạo đơn, cập nhật trạng thái | ✅ | ✅ |
| **Orders** | Xóa đơn hàng | ✅ | ❌ |
| **Promotions** | CRUD khuyến mãi | ✅ | ✅ |
| **Reports** | Thống kê doanh thu | Yes | No |

### CRUD Operations

Mỗi module hỗ trợ:
- **Create**: Thêm mới với validation
- **Read**: List với pagination, search, filter, sort
- **Update**: Cập nhật thông tin
- **Delete**: Soft delete (lưu `deleted_at`)

---

## Quick Start

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- PostgreSQL 15+

### Backend Setup

```bash
cd RetailStoreManagement
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## License

MIT License - See [LICENSE](LICENSE) for details.
