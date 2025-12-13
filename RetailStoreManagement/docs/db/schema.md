
# Database Schema

## Table: `categories`
- **Columns:**
    - `category_id`: integer (NOT NULL, primary key)
    - `category_name`: character varying (NOT NULL)
- **Indexes:**
    - `categories_pkey`

## Table: `customers`
- **Columns:**
    - `customer_id`: integer (NOT NULL, primary key)
    - `name`: character varying (NOT NULL)
    - `phone`: character varying
    - `email`: character varying
    - `address`: text
    - `created_at`: timestamp without time zone (DEFAULT CURRENT_TIMESTAMP)
- **Indexes:**
    - `customers_pkey`

## Table: `inventory`
- **Columns:**
    - `inventory_id`: integer (NOT NULL, primary key)
    - `product_id`: integer (NOT NULL, foreign key - references `products.product_id`)
    - `quantity`: integer (DEFAULT 0)
    - `updated_at`: timestamp without time zone (DEFAULT CURRENT_TIMESTAMP)
- **Indexes:**
    - `inventory_pkey`
- **Foreign Keys:**
    - `inventory_product_id_fkey`

## Table: `order_items`
- **Columns:**
    - `order_item_id`: integer (NOT NULL, primary key)
    - `order_id`: integer (foreign key - references `orders.order_id`)
    - `product_id`: integer (foreign key - references `products.product_id`)
    - `quantity`: integer (NOT NULL)
    - `price`: numeric (NOT NULL)
    - `subtotal`: numeric (NOT NULL)
- **Indexes:**
    - `order_items_pkey`
- **Foreign Keys:**
    - `order_items_order_id_fkey`
    - `order_items_product_id_fkey`

## Table: `orders`
- **Columns:**
    - `order_id`: integer (NOT NULL, primary key)
    - `customer_id`: integer (foreign key - references `customers.customer_id`)
    - `user_id`: integer (foreign key - references `users.user_id`)
    - `promo_id`: integer (foreign key - references `promotions.promo_id`)
    - `order_date`: timestamp without time zone (DEFAULT CURRENT_TIMESTAMP)
    - `status`: character varying (DEFAULT 'pending')
    - `total_amount`: numeric
    - `discount_amount`: numeric (DEFAULT 0)
- **Indexes:**
    - `orders_pkey`
- **Constraints:**
    - `orders_status_check`
- **Foreign Keys:**
    - `orders_customer_id_fkey`
    - `orders_user_id_fkey`
    - `orders_promo_id_fkey`

## Table: `payments`
- **Columns:**
    - `payment_id`: integer (NOT NULL, primary key)
    - `order_id`: integer (NOT NULL, foreign key - references `orders.order_id`)
    - `amount`: numeric (NOT NULL)
    - `payment_method`: character varying (DEFAULT 'cash')
    - `payment_date`: timestamp without time zone (DEFAULT CURRENT_TIMESTAMP)
- **Indexes:**
    - `payments_pkey`
- **Constraints:**
    - `payments_payment_method_check`
- **Foreign Keys:**
    - `payments_order_id_fkey`

## Table: `products`
- **Columns:**
    - `product_id`: integer (NOT NULL, primary key)
    - `category_id`: integer (foreign key - references `categories.category_id`)
    - `supplier_id`: integer (foreign key - references `suppliers.supplier_id`)
    - `product_name`: character varying (NOT NULL)
    - `barcode`: character varying (UNIQUE)
    - `price`: numeric (NOT NULL)
    - `unit`: character varying (DEFAULT 'pcs')
    - `created_at`: timestamp without time zone (DEFAULT CURRENT_TIMESTAMP)
- **Indexes:**
    - `products_pkey`
    - `products_barcode_key`
- **Foreign Keys:**
    - `products_category_id_fkey`
    - `products_supplier_id_fkey`

## Table: `promotions`
- **Columns:**
    - `promo_id`: integer (NOT NULL, primary key)
    - `promo_code`: character varying (NOT NULL, UNIQUE)
    - `description`: character varying
    - `discount_type`: character varying (NOT NULL)
    - `discount_value`: numeric (NOT NULL)
    - `start_date`: date (NOT NULL)
    - `end_date`: date (NOT NULL)
    - `min_order_amount`: numeric (DEFAULT 0)
    - `usage_limit`: integer (DEFAULT 0)
    - `used_count`: integer (DEFAULT 0)
    - `status`: character varying (DEFAULT 'active')
- **Indexes:**
    - `promotions_pkey`
    - `promotions_promo_code_key`
- **Constraints:**
    - `promotions_discount_type_check`
    - `promotions_status_check`

## Table: `suppliers`
- **Columns:**
    - `supplier_id`: integer (NOT NULL, primary key)
    - `name`: character varying (NOT NULL)
    - `phone`: character varying
    - `email`: character varying
    - `address`: text
- **Indexes:**
    - `suppliers_pkey`

## Table: `users`
- **Columns:**
    - `user_id`: integer (NOT NULL, primary key)
    - `username`: character varying (NOT NULL, UNIQUE)
    - `password`: character varying (NOT NULL)
    - `full_name`: character varying
    - `role`: character varying (DEFAULT 'staff')
    - `created_at`: timestamp without time zone (DEFAULT CURRENT_TIMESTAMP)
- **Indexes:**
    - `users_pkey`
    - `users_username_key`
- **Constraints:**
    - `users_role_check`
