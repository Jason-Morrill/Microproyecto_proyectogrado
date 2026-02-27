
import { User, Bell, Settings } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">CP</div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Churn Predictor <span className="text-gray-400 font-normal">| Olist E-commerce</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings size={20} />
        </button>
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
            <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-900">Data Scientist</div>
                <div className="text-xs text-gray-500">Admin</div>
            </div>
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-200">
                <User size={18} />
            </div>
        </div>
      </div>
    </div>
  );
}
