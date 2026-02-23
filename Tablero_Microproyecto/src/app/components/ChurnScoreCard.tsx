
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { CustomerProfile } from "../data/mockData";

export function ChurnScoreCard({ customer }: { customer: CustomerProfile }) {
  const prob = customer.churnProbability;
  const isHigh = prob > 0.7;
  const isMed = prob > 0.3 && prob <= 0.7;
  
  const colorClass = isHigh ? "text-red-600 bg-red-50 border-red-200" : 
                    isMed ? "text-yellow-600 bg-yellow-50 border-yellow-200" : 
                    "text-green-600 bg-green-50 border-green-200";

  const Icon = isHigh ? AlertCircle : isMed ? AlertTriangle : CheckCircle;
  const statusText = isHigh ? "Riesgo Alto" : isMed ? "Riesgo Medio" : "Riesgo Bajo";

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider absolute top-4 left-4">Probabilidad de Churn</h3>
        
        <div className="mt-6 flex flex-col items-center">
            <div className={`text-5xl font-bold mb-2 ${isHigh ? 'text-red-600' : isMed ? 'text-yellow-600' : 'text-green-600'}`}>
                {(prob * 100).toFixed(0)}%
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
                <Icon size={16} />
                {statusText}
            </div>
        </div>

        <div className="w-full mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-1000 ${isHigh ? 'bg-red-500' : isMed ? 'bg-yellow-500' : 'bg-green-500'}`} 
                style={{ width: `${prob * 100}%` }}
            />
        </div>
        <p className="mt-4 text-xs text-gray-400 text-center">
            Calculado basado en comportamiento histórico y variables de contexto.
        </p>
    </div>
  );
}
