
import { Search, Filter, RefreshCw } from "lucide-react";
import { MOCK_CUSTOMERS } from "../data/mockData";

interface FilterSidebarProps {
  selectedId: string;
  onSelectCustomer: (id: string) => void;
}

export function FilterSidebar({ selectedId, onSelectCustomer }: FilterSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Filter size={16} /> Filtros & Selección
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Buscar Cliente (ID)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select 
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                value={selectedId}
                onChange={(e) => onSelectCustomer(e.target.value)}
              >
                {MOCK_CUSTOMERS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id.substring(0, 12)}... ({c.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
            <select className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-500 cursor-not-allowed" disabled>
              <option>Todos los estados</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cohorte</label>
            <select className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-500 cursor-not-allowed" disabled>
              <option>Todas las cohortes</option>
            </select>
          </div>
          
           <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
            <select className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-500 cursor-not-allowed" disabled>
              <option>Todas las categorías</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 flex-1">
        <div className="text-xs text-gray-500 mb-2 font-medium">Segmentos Activos</div>
        <div className="flex flex-wrap gap-2">
           <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border border-blue-200">B2C</span>
           <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs border border-purple-200">Recurrentes</span>
        </div>
        
        <button className="mt-8 flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <RefreshCw size={14} /> Resetear Filtros
        </button>
      </div>
    </div>
  );
}
