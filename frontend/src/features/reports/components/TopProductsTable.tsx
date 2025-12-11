export const TopProductsTable = ({ items }: { items: any[] }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-2">Top sản phẩm bán chạy</h3>

      <table className="w-full border rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tên sản phẩm</th>
            <th className="p-2 border">Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.totalQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
