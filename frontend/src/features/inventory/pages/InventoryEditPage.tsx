import { inventoryRoutes } from '../../../app/routes/modules/crud/inventory.routes';

export function InventoryEditPage() {
  const { id } = inventoryRoutes.edit.useParams();
  const data = inventoryRoutes.edit.useLoaderData();

  console.log('Inventory Edit Data:', data);

  return (
    <div>
      <h1>Chỉnh sửa Tồn kho #{id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {/* Form chỉnh sửa sẽ ở đây */}
    </div>
  );
}

