import React from 'react';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/admin/promotions');

export const PromotionManagementPage: React.FC = () => {
  const { promotions } = routeApi.useLoaderData();
  const params = routeApi.useParams();

  console.log('Promotions:', promotions);
  console.log('Route params:', params);

  return (
    <div>
      <h1>Promotion Management</h1>
      <p>This is a placeholder for the promotion management page.</p>
      <p>It will contain a table for listing promotions and a form for creating/editing them.</p>
    </div>
  );
};
