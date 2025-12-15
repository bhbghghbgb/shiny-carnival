# Đề xuất Cấu trúc Documentation cho CustomHookAPIFactory Implementation

## Phase: CustomHookAPIFactory-Implementation

### Cấu trúc thư mục đề xuất:

```
docs/
└── CustomHookAPIFactory-Implementation/
    ├── README.md                          # Tổng quan về phase implementation
    ├── IMPLEMENTATION_PLAN.md             # Kế hoạch triển khai chi tiết
    ├── SETUP_GUIDE.md                     # Hướng dẫn setup TanStack Query và dependencies
    ├── BASE_API_INFRASTRUCTURE.md         # Tài liệu về BaseApiService, ApiServiceInterface, apiResponseAdapter
    ├── UNIVERSAL_HOOKS.md                 # Tài liệu về useApi.ts và các universal hooks
    ├── PAGINATION_HOOKS.md                # Tài liệu về usePaginationWithRouter và usePaginationLocal
    ├── PRODUCTS_MIGRATION_EXAMPLE.md      # Ví dụ migration Products feature
    ├── CODE_EXAMPLES/                     # Thư mục chứa code examples
    │   ├── BaseApiService.example.ts
    │   ├── ProductApiService.example.ts
    │   ├── useProducts.example.tsx
    │   └── Component.example.tsx
    ├── MIGRATION_GUIDE.md                 # Hướng dẫn migrate từ code cũ sang pattern mới
    ├── TESTING_GUIDE.md                   # Hướng dẫn testing cho hooks và services
    ├── TROUBLESHOOTING.md                 # Common issues và solutions
    └── RESEARCH_SUMMARY.md                # Tóm tắt research về TanStack Query và Axios patterns
```

## Mô tả từng file:

### 1. README.md
- Tổng quan về phase implementation
- Mục tiêu và scope
- Cấu trúc tài liệu
- Quick start guide

### 2. IMPLEMENTATION_PLAN.md
- Breakdown các tasks
- Timeline và dependencies
- Checklist cho từng task
- Acceptance criteria

### 3. SETUP_GUIDE.md
- Cài đặt @tanstack/react-query
- Setup QueryClient
- Setup QueryClientProvider trong app
- Configuration options

### 4. BASE_API_INFRASTRUCTURE.md
- ApiServiceInterface contract
- BaseApiService implementation
- apiResponseAdapter (unwrapResponse, handleApiError)
- Query params conversion (camelCase → PascalCase)
- Error handling patterns

### 5. UNIVERSAL_HOOKS.md
- Query Key Factory pattern
- useApiList, useApiPaginated, useApiDetail
- useApiCreate, useApiUpdate, useApiPatch, useApiDelete
- useApiCustomQuery, useApiCustomMutation
- Cache invalidation strategies

### 6. PAGINATION_HOOKS.md
- usePaginationWithRouter (URL sync)
- usePaginationLocal (local state)
- Advanced filters support
- Decision tree: khi nào dùng hook nào

### 7. PRODUCTS_MIGRATION_EXAMPLE.md
- Step-by-step migration guide
- Before/After code comparison
- Best practices
- Common pitfalls

### 8. CODE_EXAMPLES/
- Code snippets thực tế từ implementation
- Annotated examples với giải thích
- Type-safe patterns

### 9. MIGRATION_GUIDE.md
- General migration strategy
- Step-by-step process
- Breaking changes
- Backward compatibility

### 10. TESTING_GUIDE.md
- Unit testing cho BaseApiService
- Hook testing với QueryClientProvider
- Mock strategies
- Test examples

### 11. TROUBLESHOOTING.md
- Common errors và solutions
- Debug tips
- Performance issues
- Cache invalidation problems

### 12. RESEARCH_SUMMARY.md
- TanStack Query official docs summary
- Axios patterns và best practices
- Code examples từ research
- References và links

## Lưu ý:
- Tất cả tài liệu viết bằng tiếng Việt
- Code examples phải có comments giải thích
- Include source links cho external references
- Maintain consistency với tài liệu CustomHookAPIFactory-Architectured.md

