import { Card, Row, Col, Statistic, DatePicker, Space, Button } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, TrophyOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { useRevenueReport, useTopProducts, useTopCustomers } from '../hooks/useReports';
import type { RevenueReportParams, TopItemsReportParams } from '../types/api';
import { ReportOrdersModal } from './ReportOrdersModal';
import { ReportTopProductsModal } from './ReportTopProductsModal';
import { ReportTopCustomersModal } from './ReportTopCustomersModal';
import { useOrdersPaginated } from '../../orders/hooks/useOrders';
import type { OrderFilterParams } from '../../orders/types/api';
import type { OrderEntity } from '../../orders/types/entity';

const { RangePicker } = DatePicker;

interface ReportStatisticsProps {
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export const ReportStatistics = ({
  defaultStartDate,
  defaultEndDate,
}: ReportStatisticsProps) => {
  // State cho date range
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    defaultStartDate ? dayjs(defaultStartDate) : dayjs().subtract(30, 'day'),
    defaultEndDate ? dayjs(defaultEndDate) : dayjs(),
  ]);

  // Convert date range sang ISO string format (date-time) cho backend
  // Backend yêu cầu date-time format (UTC) theo swagger.json
  // Sử dụng startOf('day') và endOf('day') để đảm bảo bao phủ cả ngày
  const startDate = dateRange[0] 
    ? dateRange[0].startOf('day').toISOString() 
    : '';
  const endDate = dateRange[1] 
    ? dateRange[1].endOf('day').toISOString() 
    : '';

  // Revenue report params
  const revenueParams: RevenueReportParams = {
    startDate,
    endDate,
    groupBy: 'day',
  };

  // Top items params - Fetch với pageSize lớn để lấy đủ data cho modal
  const topItemsParams: TopItemsReportParams = {
    startDate,
    endDate,
    page: 1,
    pageSize: 100, // Lấy nhiều hơn để có đủ data cho modal
  };

  // Orders params - Fetch với pageSize lớn để lấy đủ data cho modal
  // Sử dụng cùng filter như Revenue Report: status='paid' và date range
  const ordersParams: OrderFilterParams = {
    startDate,
    endDate,
    status: 'paid', // Chỉ lấy orders đã thanh toán, giống Revenue Report
    page: 1,
    pageSize: 1000, // Lấy nhiều để đảm bảo có đủ tất cả orders trong khoảng thời gian
  };

  // Fetch reports
  const { data: revenueData, isLoading: revenueLoading } = useRevenueReport(revenueParams);
  const { data: topProductsData, isLoading: topProductsLoading } = useTopProducts(topItemsParams);
  const { data: topCustomersData, isLoading: topCustomersLoading } = useTopCustomers(topItemsParams);
  const { data: ordersData, isLoading: ordersLoading } = useOrdersPaginated(ordersParams as any);

  // Extract values từ API responses
  const totalRevenue = revenueData?.summary?.overallRevenue || 0;
  const totalOrders = revenueData?.summary?.overallOrders || 0;
  const totalDiscount = revenueData?.summary?.overallDiscount || 0;
  const topProductsCount = topProductsData?.totalCount || 0;
  const topCustomersCount = topCustomersData?.totalCount || 0;
  
  // Lưu data để truyền xuống modal
  const topProductsItems = topProductsData?.items || [];
  const topCustomersItems = topCustomersData?.items || [];
  const ordersItems: OrderEntity[] = ordersData?.items || [];
  const ordersTotal = ordersData?.totalCount || 0;

  // Modal states
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isTopProductsModalOpen, setIsTopProductsModalOpen] = useState(false);
  const [isTopCustomersModalOpen, setIsTopCustomersModalOpen] = useState(false);

  // Quick date range presets
  const handleQuickRange = (days: number) => {
    setDateRange([dayjs().subtract(days, 'day'), dayjs()]);
  };

  // Validation: Disable dates after today
  const disabledDate = (current: Dayjs | null) => {
    if (!current) return false;
    // Disable dates after today
    return current.isAfter(dayjs(), 'day');
  };

  // Handle date range change with validation
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      setDateRange(dates || [null, null]);
      return;
    }

    const [start, end] = dates;

    // Validate: startDate must be before endDate
    if (start && end && start.isAfter(end, 'day')) {
      // If startDate is after endDate, swap them
      setDateRange([end, start]);
      return;
    }

    // Validate: endDate cannot be after today
    if (end && end.isAfter(dayjs(), 'day')) {
      // Set endDate to today
      setDateRange([start, dayjs()]);
      return;
    }

    setDateRange(dates);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Date Range Picker */}
      <Card>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            allowClear={false}
            disabledDate={disabledDate}
          />
          <Button onClick={() => handleQuickRange(7)}>7 ngày</Button>
          <Button onClick={() => handleQuickRange(30)}>30 ngày</Button>
          <Button onClick={() => handleQuickRange(90)}>90 ngày</Button>
          <Button onClick={() => handleQuickRange(365)}>1 năm</Button>
        </Space>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
          >
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              loading={revenueLoading}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return `${value.toLocaleString('vi-VN')} đ`;
                }
                return value;
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
          >
            <Statistic
              title="Tổng đơn hàng"
              value={totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
              loading={revenueLoading}
            />
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => setIsOrdersModalOpen(true)}
              style={{ marginTop: 8, padding: 0 }}
            >
              Chi tiết
            </Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
          >
            <Statistic
              title="Tổng giảm giá"
              value={totalDiscount}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
              loading={revenueLoading}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return `${value.toLocaleString('vi-VN')} đ`;
                }
                return value;
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
          >
            <Statistic
              title="Sản phẩm bán chạy"
              value={topProductsCount}
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
              loading={topProductsLoading}
            />
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => setIsTopProductsModalOpen(true)}
              style={{ marginTop: 8, padding: 0 }}
            >
              Chi tiết
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
          >
            <Statistic
              title="Khách hàng mua nhiều"
              value={topCustomersCount}
              prefix={<UserOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
              loading={topCustomersLoading}
            />
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => setIsTopCustomersModalOpen(true)}
              style={{ marginTop: 8, padding: 0 }}
            >
              Chi tiết
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
          >
            <Statistic
              title="Doanh thu trung bình/đơn"
              value={totalOrders > 0 ? totalRevenue / totalOrders : 0}
              prefix={<DollarOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
              loading={revenueLoading}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return `${Math.round(value).toLocaleString('vi-VN')} đ`;
                }
                return value;
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <ReportOrdersModal
        open={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        data={ordersItems}
        total={ordersTotal}
        isLoading={ordersLoading}
      />
      <ReportTopProductsModal
        open={isTopProductsModalOpen}
        onClose={() => setIsTopProductsModalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        data={topProductsItems}
        total={topProductsCount}
        isLoading={topProductsLoading}
      />
      <ReportTopCustomersModal
        open={isTopCustomersModalOpen}
        onClose={() => setIsTopCustomersModalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        data={topCustomersItems}
        total={topCustomersCount}
        isLoading={topCustomersLoading}
      />
    </Space>
  );
};

