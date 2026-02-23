
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { STATE_CHURN_DATA } from "../data/mockData";

export function StateChurnChart() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Churn por Estado</h3>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={STATE_CHURN_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="state" 
                type="category" 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                width={30}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="churnRate" radius={[0, 4, 4, 0]} barSize={20}>
              {STATE_CHURN_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.churnRate > 50 ? '#ef4444' : entry.churnRate > 30 ? '#eab308' : '#22c55e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
