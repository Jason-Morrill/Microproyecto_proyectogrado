
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { CustomerProfile } from "../data/mockData";

export function DriversCard({ customer }: { customer: CustomerProfile }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Drivers Principales (Top 5)</h3>
      
      <div className="flex-1 space-y-3">
        {customer.drivers.map((driver, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                        driver.impact === 'negative' ? 'bg-red-100 text-red-600' :
                        driver.impact === 'positive' ? 'bg-green-100 text-green-600' :
                        'bg-gray-200 text-gray-600'
                    }`}>
                        {driver.impact === 'negative' ? <ArrowUpRight size={16} /> :
                         driver.impact === 'positive' ? <ArrowDownRight size={16} /> :
                         <Minus size={16} />}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-xs text-gray-500">{driver.value}</div>
                    </div>
                </div>
                <div className="text-xs font-semibold text-gray-400 uppercase">
                    {driver.impact === 'negative' ? '+ Riesgo' : driver.impact === 'positive' ? '- Riesgo' : 'Neutral'}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
