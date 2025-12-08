import { Skeleton } from 'antd';

export function PendingComponent() {
  return (
    <div style={{ padding: '24px' }}>
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  );
}

