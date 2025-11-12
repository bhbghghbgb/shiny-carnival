import React from 'react';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/admin/reports');

export const ReportManagementPage: React.FC = () => {
  const { reports } = routeApi.useLoaderData();
  const params = routeApi.useParams();

  console.log('Reports:', reports);
 console.log('Route params:', params);

  return (
    <div>
      <h1>Report Management</h1>
      <p>This is a placeholder for the report management page.</p>
      <p>It will contain a table for listing reports and a form for creating/editing them.</p>
    </div>
  );
};
