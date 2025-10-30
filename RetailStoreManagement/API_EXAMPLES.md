# API Testing Examples

This document provides example requests for testing the Retail Store Management API.

## Base URL

```
http://localhost:5000/api
```

## Authentication

### 1. Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "isError": false,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "fullName": "System Administrator",
      "role": 0
    }
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

**Use the token in subsequent requests:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## User Management (Admin Only)

### 2. Create Staff User

**Request:**
```http
POST /api/admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "staff01",
  "password": "staff123",
  "fullName": "John Doe",
  "role": 1
}
```

### 3. Get All Users (Paginated)

**Request:**
```http
GET /api/admin/users?page=1&pageSize=20&search=john&sortBy=Id&sortDesc=true
Authorization: Bearer <token>
```

### 4. Update User

**Request:**
```http
PUT /api/admin/users/2
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 2,
  "username": "staff01",
  "fullName": "John Smith",
  "role": 1
}
```

## Category Management

### 5. Create Category

**Request:**
```http
POST /api/admin/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryName": "Toys"
}
```

### 6. Get All Categories

**Request:**
```http
GET /api/admin/categories?page=1&pageSize=20
Authorization: Bearer <token>
```

## Supplier Management

### 7. Create Supplier

**Request:**
```http
POST /api/admin/suppliers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "ABC Electronics Co.",
  "phone": "+1234567890",
  "email": "contact@abc-electronics.com",
  "address": "123 Business St, Tech City, TC 12345"
}
```

## Product Management

### 8. Create Product

**Request:**
```http
POST /api/admin/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryId": 1,
  "supplierId": 1,
  "productName": "Wireless Mouse",
  "barcode": "WM001",
  "price": 29.99,
  "unit": "pcs"
}
```

### 9. Search Products

**Request:**
```http
GET /api/admin/products?page=1&pageSize=20&search=mouse&categoryId=1&minPrice=10&maxPrice=50
Authorization: Bearer <token>
```

### 10. Update Product

**Request:**
```http
PUT /api/admin/products/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": 1,
  "categoryId": 1,
  "supplierId": 1,
  "productName": "Wireless Gaming Mouse",
  "barcode": "WM001",
  "price": 39.99,
  "unit": "pcs"
}
```

## Customer Management

### 11. Create Customer

**Request:**
```http
POST /api/admin/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "phone": "+1987654321",
  "email": "jane.smith@email.com",
  "address": "456 Customer Ave, City, ST 67890"
}
```

### 12. Get Customer Details

**Request:**
```http
GET /api/admin/customers/1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "isError": false,
  "message": null,
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "phone": "+1987654321",
    "email": "jane.smith@email.com",
    "address": "456 Customer Ave, City, ST 67890",
    "totalOrders": 5,
    "totalSpent": 1250.50,
    "createdAt": "2025-10-30T10:00:00Z"
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

## Promotion Management

### 13. Create Promotion

**Request:**
```http
POST /api/admin/promotions
Authorization: Bearer <token>
Content-Type: application/json

{
  "promoCode": "SUMMER2025",
  "description": "Summer Sale - 20% off",
  "discountType": "percent",
  "discountValue": 20,
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-08-31T23:59:59Z",
  "minOrderAmount": 100,
  "usageLimit": 1000,
  "status": "active"
}
```

### 14. Validate Promotion

**Request:**
```http
POST /api/admin/promotions/validate
Authorization: Bearer <token>
Content-Type: application/json

{
  "promoCode": "SUMMER2025",
  "orderAmount": 150.00
}
```

**Response:**
```json
{
  "isError": false,
  "message": null,
  "data": {
    "isValid": true,
    "message": "Promo code is valid",
    "discountAmount": 30.00,
    "promoId": 1
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

## Inventory Management

### 15. Update Inventory

**Request:**
```http
PATCH /api/admin/inventory/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantityChange": 50,
  "reason": "Stock replenishment from supplier"
}
```

### 16. Get Low Stock Alerts

**Request:**
```http
GET /api/admin/inventory/low-stock?threshold=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "isError": false,
  "message": null,
  "data": [
    {
      "productId": 5,
      "productName": "USB Cable",
      "barcode": "USB001",
      "currentQuantity": 3,
      "threshold": 10
    }
  ],
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### 17. Get Inventory History

**Request:**
```http
GET /api/admin/inventory/1/history?page=1&pageSize=20
Authorization: Bearer <token>
```

## Order Management

### 18. Create Order

**Request:**
```http
POST /api/admin/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": 1,
  "promoCode": "SUMMER2025",
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "isError": false,
  "message": null,
  "data": {
    "id": 1,
    "customerId": 1,
    "customerName": "Jane Smith",
    "customerPhone": "+1987654321",
    "userId": 1,
    "staffName": "System Administrator",
    "promoId": 1,
    "promoCode": "SUMMER2025",
    "orderDate": "2025-10-30T12:00:00Z",
    "status": "Pending",
    "totalAmount": 150.00,
    "discountAmount": 30.00,
    "finalAmount": 120.00,
    "orderItems": [
      {
        "orderItemId": 1,
        "productId": 1,
        "productName": "Wireless Gaming Mouse",
        "barcode": "WM001",
        "quantity": 2,
        "price": 39.99,
        "subtotal": 79.98
      },
      {
        "orderItemId": 2,
        "productId": 3,
        "productName": "Keyboard",
        "barcode": "KB001",
        "quantity": 1,
        "price": 70.02,
        "subtotal": 70.02
      }
    ],
    "paymentInfo": null
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### 19. Update Order Status to Paid

**Request:**
```http
PATCH /api/admin/orders/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "paid"
}
```

### 20. Get Order Details

**Request:**
```http
GET /api/admin/orders/1
Authorization: Bearer <token>
```

### 21. Search Orders

**Request:**
```http
GET /api/admin/orders?page=1&pageSize=20&status=paid&customerId=1&startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer <token>
```

### 22. Download Invoice

**Request:**
```http
GET /api/admin/orders/1/invoice
Authorization: Bearer <token>
```

**Response:** PDF file download

## Reports

### 23. Revenue Report

**Request:**
```http
GET /api/admin/reports/revenue?startDate=2025-10-01&endDate=2025-10-31&groupBy=day
Authorization: Bearer <token>
```

**Response:**
```json
{
  "isError": false,
  "message": null,
  "data": {
    "summary": {
      "overallRevenue": 15000.00,
      "overallOrders": 125,
      "overallDiscount": 1500.00,
      "averageOrderValue": 120.00,
      "period": "2025-10-01 to 2025-10-31"
    },
    "details": [
      {
        "period": "2025-10-01",
        "totalRevenue": 500.00,
        "totalOrders": 5,
        "totalDiscount": 50.00,
        "averageOrderValue": 100.00,
        "date": "2025-10-01T00:00:00Z"
      }
    ]
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### 24. Sales Report

**Request:**
```http
GET /api/admin/reports/sales?startDate=2025-10-01&endDate=2025-10-31&categoryId=1
Authorization: Bearer <token>
```

### 25. Top Products

**Request:**
```http
GET /api/admin/reports/top-products?startDate=2025-10-01&endDate=2025-10-31&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "isError": false,
  "message": null,
  "data": [
    {
      "productId": 1,
      "productName": "Wireless Gaming Mouse",
      "totalQuantitySold": 150,
      "totalRevenue": 5998.50,
      "orderCount": 75
    }
  ],
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### 26. Top Customers

**Request:**
```http
GET /api/admin/reports/top-customers?startDate=2025-10-01&endDate=2025-10-31&limit=10
Authorization: Bearer <token>
```

## Error Responses

### Validation Error

```json
{
  "isError": true,
  "message": "Validation failed",
  "data": null,
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### Unauthorized

```json
{
  "isError": true,
  "message": "Unauthorized",
  "data": null,
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### Not Found

```json
{
  "isError": true,
  "message": "Product not found",
  "data": null,
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### Business Logic Error

```json
{
  "isError": true,
  "message": "Insufficient stock for product: Wireless Gaming Mouse",
  "data": null,
  "timestamp": "2025-10-30T12:00:00Z"
}
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Create Product (with token)
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "supplierId": 1,
    "productName": "Wireless Mouse",
    "barcode": "WM001",
    "price": 29.99,
    "unit": "pcs"
  }'
```

### Get Products
```bash
curl -X GET "http://localhost:5000/api/admin/products?page=1&pageSize=20" \
  -H "Authorization: Bearer $TOKEN"
```

## Testing with Postman

1. Import the API into Postman
2. Create an environment with:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (will be set after login)
3. Create a login request and save the token to environment
4. Use `{{baseUrl}}` and `{{token}}` in subsequent requests

## Testing with Swagger

1. Navigate to `http://localhost:5000`
2. Click "Authorize" button
3. Login and copy the token
4. Enter `Bearer <token>` in the authorization dialog
5. Test endpoints directly in Swagger UI
