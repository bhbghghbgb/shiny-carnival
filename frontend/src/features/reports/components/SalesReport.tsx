import type { RevenueReportDto } from "../types/entity";

export const SalesReport = ({ data }: { data: RevenueReportDto }) => {
  if (!data) return null;

  const { summary, details } = data;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-4">Báo cáo bán hàng</h3>

      {/* Tổng quan */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500">Tổng doanh thu</p>
          <p className="text-xl font-bold text-green-600">
            {summary.overallRevenue.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500">Tổng đơn hàng</p>
          <p className="text-xl font-bold text-blue-600">
            {summary.overallOrders.toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <p className="text-gray-500">Tổng giảm giá</p>
          <p className="text-xl font-bold text-red-600">
            {summary.overallDiscount.toLocaleString("vi-VN")}₫
          </p>
        </div>
      </div>

      {/* Bảng chi tiết */}
      <table className="w-full border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Kỳ</th>
            <th className="p-2 border">Đơn hàng</th>
            <th className="p-2 border">Doanh thu</th>
            <th className="p-2 border">Giảm giá</th>
          </tr>
        </thead>

        <tbody>
          {details.map((d) => (
            <tr key={d.period}>
              <td className="p-2 border">{d.period}</td>
              <td className="p-2 border">{d.totalOrders.toLocaleString("vi-VN")}</td>
              <td className="p-2 border text-green-700">
                {d.totalRevenue.toLocaleString("vi-VN")}₫
              </td>
              <td className="p-2 border text-red-600">
                {d.totalDiscount.toLocaleString("vi-VN")}₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
