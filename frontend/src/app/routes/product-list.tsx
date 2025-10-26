import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import  ProductList  from '../../features/products/pages/ProductList.tsx';
import { productApi } from '../../features/products/api/productApi.ts';
import { PendingComponent } from '../../components/feedback/PendingComponent.tsx';
import { ErrorComponent } from '../../components/feedback/ErrorComponent.tsx';

// Schema để xác thực search params cho trang sản phẩm
const productSearchSchema = z.object({
  page: z.number().catch(1), // Mặc định là trang 1 nếu không có
  pageSize: z.number().catch(10), // Mặc định 10 sản phẩm mỗi trang
  search: z.string().optional(),
  // Thêm các filter khác nếu cần
});

// Suy ra kiểu từ schema để sử dụng trong loader
type TProductSearch = z.infer<typeof productSearchSchema>;



export const Route = createFileRoute('/product-list')({
  // validateSearch: productSearchSchema,
  // loaderDeps: ({ search }: { search: TProductSearch }) => search,
  // loader: ({ deps }: { deps: TProductSearch }) => productApi.getProducts(deps),
  //   Todo: Sử dụng component ProductManagementPage khi có API
  component: ProductList,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
});
