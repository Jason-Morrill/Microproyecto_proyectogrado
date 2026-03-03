import { CustomerData } from '../App';

interface CustomerInputSidebarProps {
  customerData: CustomerData;
  setCustomerData: (data: CustomerData) => void;
}

const brazilianStates = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
];

export function CustomerInputSidebar({ customerData, setCustomerData }: CustomerInputSidebarProps) {
  const handleChange = (field: keyof CustomerData, value: string | number) => {
    setCustomerData({ ...customerData, [field]: value });
  };

  return (
    <div className="w-80 bg-white shadow-lg overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Data</h2>

        <div className="space-y-5">
          {/* RFM Features */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-3">RFM Analysis</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Recency (days since last purchase)
                </label>
                <input
                  type="number"
                  value={customerData.recency}
                  onChange={(e) => handleChange('recency', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Frequency (total orders)
                </label>
                <input
                  type="number"
                  value={customerData.frequency}
                  onChange={(e) => handleChange('frequency', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="1"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Monetary (total spend $)
                </label>
                <input
                  type="number"
                  value={customerData.monetary}
                  onChange={(e) => handleChange('monetary', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="10"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Order Metrics */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Order Metrics</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Avg. Items per Order
                </label>
                <input
                  type="number"
                  value={customerData.avg_num_items}
                  onChange={(e) => handleChange('avg_num_items', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Avg. Order Value ($)
                </label>
                <input
                  type="number"
                  value={customerData.avg_price_sum}
                  onChange={(e) => handleChange('avg_price_sum', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Avg. Freight Cost ($)
                </label>
                <input
                  type="number"
                  value={customerData.avg_freight_sum}
                  onChange={(e) => handleChange('avg_freight_sum', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="1"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Satisfaction */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Delivery & Satisfaction</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Avg. Review Score (1-5)
                </label>
                <input
                  type="number"
                  value={customerData.avg_review_score}
                  onChange={(e) => handleChange('avg_review_score', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                  min="1"
                  max="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Avg. Delivery Days
                </label>
                <input
                  type="number"
                  value={customerData.avg_delivery_days}
                  onChange={(e) => handleChange('avg_delivery_days', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Avg. Late Days
                </label>
                <input
                  type="number"
                  value={customerData.avg_late_days}
                  onChange={(e) => handleChange('avg_late_days', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="1"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Location</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Customer State
              </label>
              <select
                value={customerData.customer_state}
                onChange={(e) => handleChange('customer_state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {brazilianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
