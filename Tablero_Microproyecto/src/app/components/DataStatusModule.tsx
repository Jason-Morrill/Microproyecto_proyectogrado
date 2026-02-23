
import { CheckCircle, Calendar, FileText } from "lucide-react";

export function DataStatusModule() {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText size={16} className="text-blue-600" />
          <span className="font-medium text-gray-900">Dataset:</span> olist_orders.csv
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-blue-600" />
          <span className="font-medium text-gray-900">Rango:</span> Ene 2017 - Ago 2018
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
        <CheckCircle size={14} />
        Datos Cargados
      </div>
    </div>
  );
}
