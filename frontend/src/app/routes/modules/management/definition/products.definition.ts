import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition } from '../../../type/types';
import { products as mockProducts } from '../../../../../_mocks/products';
import {ProductManagementPage} from "../../../../../features/products/pages/ProductManagementPage.tsx";

// 1. Định nghĩa Types và API

interface Product {
  id: number;
  categoryId: number;
  supplierId: number;
  productName: string;
  barcode: string;
  price: number;
  unit: string;
  createdAt: string;
}

interface ProductLoaderData {
  products: Product[];
  total: number;
}

const productSearchSchema = baseSearchSchema.extend({
  category: z.string().optional(),
  // minPrice: z.number().optional(),
  // maxPrice: z.number().optional(),
  // inStock: z.boolean().optional(),
});

export type ProductSearch = z.infer<typeof productSearchSchema>;

async function fetchProducts(search: ProductSearch): Promise<ProductLoaderData> {
  console.log('Fetching products with filters:', search);
  // Giả lập gọi API
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    products: mockProducts,
    total: mockProducts.length,
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị

export const productAdminDefinition: ManagementRouteDefinition<
  ProductLoaderData,     // Kiểu loader data
  ProductSearch,         // Kiểu search params
  { apiClient: never }     // Kiểu router context (ví dụ)
> = {
  entityName: 'Sản phẩm',
  path: 'products',
  component: ProductManagementPage,
  searchSchema: productSearchSchema,
  loader: ({ search }) => fetchProducts(search),
};