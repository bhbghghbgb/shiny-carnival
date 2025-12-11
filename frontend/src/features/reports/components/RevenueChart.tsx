// components/RevenueChart.tsx
import ReactApexChart from "react-apexcharts";

export const RevenueChart = ({
  title,
  report,
}: {
  title: string;
  report: { items: { label: string; total: number }[] };
}) => {
  if (!report) return null;

  const labels = report.items.map((i) => i.label);
  const values = report.items.map((i) => i.total);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <ReactApexChart
        type="line"
        height={300}
        series={[{ name: "Doanh thu", data: values }]}
        options={{
          chart: { toolbar: { show: false } },
          xaxis: { categories: labels },
          stroke: { curve: "smooth", width: 3 },
          tooltip: {
            y: {
              formatter: (val: number) => val.toLocaleString("vi-VN") + "₫",
            },
          },
          dataLabels: { enabled: false },
        }}
      />
    </div>
  );
};
