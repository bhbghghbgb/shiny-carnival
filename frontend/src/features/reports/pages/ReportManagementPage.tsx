import React, { useEffect, useState } from "react";
import reportApi from "../api/reportApi";
import { RevenueChart } from "../components/RevenueChart";
import type { RevenueReportParams } from "../types/api";
import type { RevenueReportDto } from "../types/entity";

export const ReportManagementPage: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  const [report, setReport] = useState<RevenueReportDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const [salesReport, setSalesReport] = useState<any>(null);
  // const [topProducts, setTopProducts] = useState<any[]>([]);
  // const [topCustomers, setTopCustomers] = useState<any[]>([])

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: RevenueReportParams = { startDate, endDate, groupBy };
      const res = await reportApi.getRevenueReport(params);
      if (res.isError) {
        setError(res.message || "Có lỗi khi lấy báo cáo");
      } else {
        setReport(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, groupBy]);

  // Convert report.details → items cho RevenueChart
  const chartData = report
    ? { items: report.details.map((d) => ({ label: d.period, total: d.totalRevenue })) }
    : { items: [] };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Báo cáo doanh thu</h1>

      {/* Form chọn thời gian và groupBy */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Từ ngày</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Đến ngày</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Group By</label>
          <select
            className="border p-2 rounded"
            value={groupBy}
            onChange={(e) =>
              setGroupBy(e.target.value as "day" | "week" | "month")
            }
          >
            <option value="day">Ngày</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
          </select>
        </div>

        <div className="self-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={fetchReport}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Xem báo cáo"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Summary */}
      {report && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Tổng doanh thu</p>
            <p className="text-lg font-bold text-green-600">
              {report.summary.overallRevenue.toLocaleString("vi-VN")}₫
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
            <p className="text-lg font-bold">
              {report.summary.overallOrders.toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Tổng giảm giá</p>
            <p className="text-lg font-bold text-red-600">
              {report.summary.overallDiscount.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {report && <RevenueChart title="Biểu đồ doanh thu" report={chartData} />}
{/*       
      <SalesReport data={salesReport} />
      <TopProductsTable items={topProducts} />
      <TopCustomersTable items={topCustomers} /> */}
    </div>
  );
};
