import { inventoryRoutes } from '../../../app/routes/modules/crud/inventory.routes';

export function InventoryListPage() {
  const { items, total } = inventoryRoutes.list.useLoaderData();
  const search = inventoryRoutes.list.useSearch();

  return (
    <div>
      <h1>Quản lý Kho hàng ({total} kết quả)</h1>
      <p>Trang: {search.page}</p>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
