import { inventoryRoutes } from '../../../app/routes/modules/crud/inventory.routes';

export function InventoryDetailPage() {
  const { id } = inventoryRoutes.detail.useParams();
  const data = inventoryRoutes.detail.useLoaderData();

  console.log('Inventory Detail Data:', data);

  return (
    <div>
      <h1>Chi tiết Tồn kho #{id}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

