import { GenericPage } from '../../../components/GenericCRUD/GenericPage';
import { ReportStatistics } from '../components/ReportStatistics';
import { reportPageConfig } from '../config/reportPageConfig';

/**
 * ReportManagementPage - Trang quản lý báo cáo
 * 
 * Sử dụng GenericPage nhưng không có Table, chỉ hiển thị các Statistic
 * Dữ liệu được fetch và hiển thị trong ReportStatistics component
 * Table được ẩn bằng CSS vì không cần thiết cho trang báo cáo
 */
export function ReportManagementPage() {
  // Dummy data để GenericPage hoạt động
  const dummyData: Array<{ id: number }> = [];

  return (
    <div style={{ padding: '24px' }}>
      <GenericPage
        config={reportPageConfig}
        data={dummyData}
        total={0}
        loading={false}
        page={1}
        pageSize={10}
        onCreate={undefined}
        onUpdate={undefined}
        onDelete={undefined}
        renderHeader={() => (
          <h1 style={{ marginBottom: 0 }}>Báo cáo & Thống kê</h1>
        )}
        statisticsSlot={<ReportStatistics />}
        renderCustomForm={() => null}
      />
    </div>
  );
}
