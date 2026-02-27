
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";
import { CustomerProfile } from "../data/mockData";

export function ComparisonChart({ customer }: { customer: CustomerProfile }) {
  // Normalize data for Radar Chart (0-100 scale)
  const data = customer.segmentComparison.map(item => ({
    subject: item.metric.split(" ")[0], // Take first word for label
    fullSubject: item.metric,
    A: (item.customerValue / item.fullMark) * 100, // Customer
    B: (item.segmentAvg / item.fullMark) * 100, // Segment
    valA: item.customerValue,
    valB: item.segmentAvg
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-xs">
          <p className="font-bold mb-1">{payload[0].payload.fullSubject}</p>
          <p className="text-blue-600">Cliente: {payload[0].payload.valA}</p>
          <p className="text-gray-500">Segmento: {payload[0].payload.valB}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Cliente vs Segmento</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Cliente"
              dataKey="A"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
            <Radar
              name="Promedio Segmento"
              dataKey="B"
              stroke="#9ca3af"
              fill="#9ca3af"
              fillOpacity={0.2}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
