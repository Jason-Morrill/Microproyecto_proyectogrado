
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { DISTRIBUTION_DATA, CustomerProfile } from "../data/mockData";

export function DistributionChart({ customer }: { customer: CustomerProfile }) {
  const customerProb = (customer.churnProbability * 100).toFixed(0);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Distribución de Probabilidad</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Todas las cuentas</span>
      </div>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
                dataKey="prob" 
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                tickLine={false}
                axisLine={false}
                label={{ value: 'Probabilidad Churn (%)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#9ca3af' }} 
            />
            <YAxis hide />
            <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey="density" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDensity)" />
            <ReferenceLine x={customerProb} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Cliente', fill: 'red', fontSize: 10 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
