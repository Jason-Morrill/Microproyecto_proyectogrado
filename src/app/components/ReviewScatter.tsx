
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis } from "recharts";
import { SCATTER_DATA } from "../data/mockData";

export function ReviewScatter() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Retraso vs Probabilidad Churn</h3>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
                type="number" 
                dataKey="delay" 
                name="Retraso" 
                unit=" días" 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                label={{ value: 'Retraso (días)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#9ca3af' }}
            />
            <YAxis 
                type="number" 
                dataKey="churnProb" 
                name="Probabilidad" 
                unit="" 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                label={{ value: 'P(Churn)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9ca3af' }}
            />
            <ZAxis type="number" dataKey="review" range={[20, 100]} name="Review Score" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
            <Scatter name="Clientes" data={SCATTER_DATA} fill="#8884d8" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
