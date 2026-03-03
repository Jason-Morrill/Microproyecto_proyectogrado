import { useState } from 'react';
import { CustomerInputSidebar } from './components/customer-input-sidebar';
import { ChurnDashboard } from './components/churn-dashboard';
import modelWeights from '../imports/model_weights.json';

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

  // Calculate churn probability using logistic regression
  const calculateChurnProbability = (data: CustomerData): number => {
    let logit = modelWeights.intercept;

    // Add numerical features
    const numFeatures = modelWeights.features.filter(f => f.name.startsWith('num__'));
    numFeatures.forEach(feature => {
      const featureName = feature.name.replace('num__', '');
      const key = featureName.toLowerCase().replace(/_/g, '_') as keyof CustomerData;
      
      if (key === 'recency') logit += feature.weight * data.recency;
      else if (key === 'frequency') logit += feature.weight * data.frequency;
      else if (key === 'monetary') logit += feature.weight * data.monetary;
      else if (key === 'avg_review_score') logit += feature.weight * data.avg_review_score;
      else if (key === 'avg_delivery_days') logit += feature.weight * data.avg_delivery_days;
      else if (key === 'avg_late_days') logit += feature.weight * data.avg_late_days;
      else if (key === 'avg_num_items') logit += feature.weight * data.avg_num_items;
      else if (key === 'avg_price_sum') logit += feature.weight * data.avg_price_sum;
      else if (key === 'avg_freight_sum') logit += feature.weight * data.avg_freight_sum;
    });

    // Add categorical feature (one-hot encoded)
    const stateFeature = modelWeights.features.find(
      f => f.name === `cat__customer_state_${data.customer_state}`
    );
    if (stateFeature) {
      logit += stateFeature.weight;
    }

    // Apply sigmoid function
    const probability = 1 / (1 + Math.exp(-logit));
    return probability;
  };

  const churnProbability = calculateChurnProbability(customerData);

  return (
    <div className="flex h-screen bg-gray-50">
      <CustomerInputSidebar customerData={customerData} setCustomerData={setCustomerData} />
      <ChurnDashboard churnProbability={churnProbability} customerData={customerData} />
    </div>
  );
}
