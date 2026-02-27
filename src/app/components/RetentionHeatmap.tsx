
import { COHORT_DATA } from "../data/mockData";

export function RetentionHeatmap() {
  const getColor = (value: number | null) => {
    if (value === null) return "bg-gray-50";
    // Blue scale based on value
    if (value >= 50) return "bg-blue-600 text-white";
    if (value >= 40) return "bg-blue-500 text-white";
    if (value >= 35) return "bg-blue-400 text-white";
    if (value >= 30) return "bg-blue-300 text-gray-800";
    if (value >= 20) return "bg-blue-200 text-gray-800";
    return "bg-blue-100 text-gray-800";
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Cohortes de Retención</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
            {/* Header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                <div className="text-xs font-semibold text-gray-400 col-span-2">Cohorte</div>
                {[0, 1, 2, 3, 4].map(m => (
                    <div key={m} className="text-xs font-semibold text-gray-400 text-center">M{m}</div>
                ))}
            </div>
            
            {/* Rows */}
            <div className="space-y-1">
                {COHORT_DATA.map((row) => (
                    <div key={row.cohort} className="grid grid-cols-7 gap-1">
                        <div className="col-span-2 text-xs font-medium text-gray-600 flex items-center">{row.cohort}</div>
                        {[row.m0, row.m1, row.m2, row.m3, row.m4].map((val, idx) => (
                            <div 
                                key={idx} 
                                className={`h-8 flex items-center justify-center text-xs rounded ${getColor(val)}`}
                                title={val ? `${val}%` : "N/A"}
                            >
                                {val ? `${val}%` : ""}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
