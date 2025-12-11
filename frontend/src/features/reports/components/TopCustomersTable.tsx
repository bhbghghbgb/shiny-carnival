export const TopCustomersTable = ({ items }: { items: any[] }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-2">Top khách hàng mua nhiều</h3>

      <table className="w-full border rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Khách hàng</th>
            <th className="p-2 border">Tổng đơn</th>
            <th className="p-2 border">Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.totalOrders}</td>
              <td className="p-2 border">
                {c.totalMoney?.toLocaleString("vi-VN")}₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
