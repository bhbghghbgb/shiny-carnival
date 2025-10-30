import React from 'react';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/admin/suppliers');

export const SupplierManagementPage: React.FC = () => {
  const { suppliers } = routeApi.useLoaderData();
  const params = routeApi.useParams();

  console.log('Suppliers:', suppliers);
 console.log('Route params:', params);

  return (
    <div>
      <h1>Supplier Management</h1>
      <p>This is a placeholder for the supplier management page.</p>
      <p>It will contain a table for listing suppliers and a form for creating/editing them.</p>
    </div>
  );
};
