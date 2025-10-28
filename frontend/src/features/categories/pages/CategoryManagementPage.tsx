import React from 'react';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/admin/categories');

export const CategoryManagementPage: React.FC = () => {
  const { categories } = routeApi.useLoaderData();
  const params = routeApi.useParams();

  console.log('Categories:', categories);
 console.log('Route params:', params);

  return (
    <div>
      <h1>Category Management</h1>
      <p>This is a placeholder for the category management page.</p>
      <p>It will contain a table for listing categories and a form for creating/editing them.</p>
    </div>
  );
};
