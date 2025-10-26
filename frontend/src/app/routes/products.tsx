import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ProductManagementPage } from '../../features/products/pages/ProductManagementPage';
import { productApi } from '../../features/products/api/productApi';
import { PendingComponent } from '../../components/feedback/PendingComponent';
import { ErrorComponent } from '../../components/feedback/ErrorComponent';
import {ProductManagementMockPage} from "../../features/products/pages/ProductManagementMockPage.tsx";

// Schema để xác thực search params cho trang sản phẩm
const productSearchSchema = z.object({
  page: z.number().catch(1), // Mặc định là trang 1 nếu không có
  pageSize: z.number().catch(10), // Mặc định 10 sản phẩm mỗi trang
  search: z.string().optional(),
  // Thêm các filter khác nếu cần
});

// Suy ra kiểu từ schema để sử dụng trong loader
type TProductSearch = z.infer<typeof productSearchSchema>;



export const Route = createFileRoute('/products')({
  // validateSearch: productSearchSchema,
  // loaderDeps: ({ search }: { search: TProductSearch }) => search,
  // loader: ({ deps }: { deps: TProductSearch }) => productApi.getProducts(deps),
  //   Todo: Sử dụng component ProductManagementPage khi có API
  component: ProductManagementMockPage,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
});
