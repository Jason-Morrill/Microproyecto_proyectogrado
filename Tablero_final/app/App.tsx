import { useState, useEffect } from 'react';
import { CustomerInputSidebar } from './components/customer-input-sidebar';
import { ChurnDashboard } from './components/churn-dashboard';
// modelWeights is no longer needed in the client when calling the API
// import modelWeights from '../imports/model_weights.json';

export interface CustomerData {
  recency: number;
  frequency: number;
  monetary: number;
  avg_review_score: number;
  avg_delivery_days: number;
  avg_late_days: number;
  avg_num_items: number;
  avg_price_sum: number;
  avg_freight_sum: number;
  customer_state: string;
}

// the original local prediction logic has been removed; the app now requests an API

function getApiBase(): string {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }

  return 'http://localhost:3000';
}

export default function App() {
  const [customerData, setCustomerData] = useState<CustomerData>({
    recency: 30,
    frequency: 5,
    monetary: 500,
    avg_review_score: 4.0,
    avg_delivery_days: 10,
    avg_late_days: 0,
    avg_num_items: 2,
    avg_price_sum: 100,
    avg_freight_sum: 15,
    customer_state: 'SP',
  });

  const [churnProbability, setChurnProbability] = useState(0);
  const [loading, setLoading] = useState(false); // kept for potential spinner

  const API_BASE = getApiBase();

  useEffect(() => {
    async function fetchPrediction() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData),
        });
        const json = await res.json();
        setChurnProbability(json.churnProbability);
      } catch (err) {
        console.error('prediction error', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrediction();
  }, [customerData]);

  return (
    <div className="flex h-screen bg-gray-50">
      <CustomerInputSidebar
        customerData={customerData}
        setCustomerData={setCustomerData}
      />
      <ChurnDashboard
        churnProbability={churnProbability}
        customerData={customerData}
      />
    </div>
  );
}
