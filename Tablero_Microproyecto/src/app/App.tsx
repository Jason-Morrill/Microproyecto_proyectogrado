
import { useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { DataStatusModule } from './components/DataStatusModule';
import { FilterSidebar } from './components/FilterSidebar';
import { ChurnScoreCard } from './components/ChurnScoreCard';
import { DriversCard } from './components/DriversCard';
import { ComparisonChart } from './components/ComparisonChart';
import { DistributionChart } from './components/DistributionChart';
import { RetentionHeatmap } from './components/RetentionHeatmap';
import { StateChurnChart } from './components/StateChurnChart';
import { ReviewScatter } from './components/ReviewScatter';
import { MOCK_CUSTOMERS } from './data/mockData';

export default function App() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(MOCK_CUSTOMERS[0].id);

  // Find the full customer object based on selection
  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomerId) || MOCK_CUSTOMERS[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <DashboardHeader />
      <DataStatusModule />
      
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Sidebar - Mobile: Auto height, Desktop: Full height fixed */}
        <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex-shrink-0 overflow-y-auto max-h-[300px] lg:max-h-full">
            <FilterSidebar 
                selectedId={selectedCustomerId} 
                onSelectCustomer={setSelectedCustomerId} 
            />
        </div>

        {/* Main Content Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Section 1: Individual Customer Analysis */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
                        Análisis Individual
                        <span className="text-sm font-normal text-gray-500 ml-2">ID: {selectedCustomer.id}</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Score */}
                        <div className="h-80">
                            <ChurnScoreCard customer={selectedCustomer} />
                        </div>
                        {/* 2. Drivers */}
                        <div className="h-80">
                            <DriversCard customer={selectedCustomer} />
                        </div>
                        {/* 3. Comparison */}
                        <div className="h-80">
                            <ComparisonChart customer={selectedCustomer} />
                        </div>
                    </div>
                </div>

                {/* Section 2: Macro / Expert Views */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-600 rounded-full inline-block"></span>
                        Visualizaciones Macro (Expertos)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-72">
                            <DistributionChart customer={selectedCustomer} />
                        </div>
                        <div className="h-72">
                            <RetentionHeatmap />
                        </div>
                        <div className="h-72">
                            <StateChurnChart />
                        </div>
                         <div className="h-72">
                            <ReviewScatter />
                        </div>
                    </div>
                </div>

            </div>
            
            <footer className="mt-12 mb-6 text-center text-xs text-gray-400">
                Churn Predictor v1.0 • Olist Data Analysis • 2024
            </footer>
        </main>
      </div>
    </div>
  );
}
