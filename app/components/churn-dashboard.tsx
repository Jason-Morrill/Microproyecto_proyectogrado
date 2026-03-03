import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { CustomerData } from '../App';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import modelWeights from '../../imports/model_weights.json';

interface ChurnDashboardProps {
  churnProbability: number;
  customerData: CustomerData;
}

export function ChurnDashboard({ churnProbability, customerData }: ChurnDashboardProps) {
  const churnPercentage = (churnProbability * 100).toFixed(1);
  const retentionPercentage = ((1 - churnProbability) * 100).toFixed(1);

  // Determine risk level
  let riskLevel = 'Low';
  let riskColor = 'text-green-600';
  let riskBgColor = 'bg-green-50';
  let riskBorderColor = 'border-green-200';

  if (churnProbability >= 0.7) {
    riskLevel = 'High';
    riskColor = 'text-red-600';
    riskBgColor = 'bg-red-50';
    riskBorderColor = 'border-red-200';
  } else if (churnProbability >= 0.4) {
    riskLevel = 'Medium';
    riskColor = 'text-orange-600';
    riskBgColor = 'bg-orange-50';
    riskBorderColor = 'border-orange-200';
  }

  // Calculate feature contributions
  const getFeatureContributions = () => {
    const contributions: Array<{ name: string; value: number; impact: string }> = [];

    // Numerical features
    const featureMapping: Record<string, keyof CustomerData> = {
      'num__Recency': 'recency',
      'num__Frequency': 'frequency',
      'num__Monetary': 'monetary',
      'num__avg_review_score': 'avg_review_score',
      'num__avg_delivery_days': 'avg_delivery_days',
      'num__avg_late_days': 'avg_late_days',
      'num__avg_num_items': 'avg_num_items',
      'num__avg_price_sum': 'avg_price_sum',
      'num__avg_freight_sum': 'avg_freight_sum',
    };

    Object.entries(featureMapping).forEach(([featureName, dataKey]) => {
      const feature = modelWeights.features.find(f => f.name === featureName);
      if (feature) {
        const value = customerData[dataKey] as number;
        const contribution = feature.weight * value;
        const displayName = featureName.replace('num__', '').replace(/_/g, ' ');
        contributions.push({
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          value: contribution,
          impact: contribution > 0 ? 'increase' : 'decrease'
        });
      }
    });

    // State feature
    const stateFeature = modelWeights.features.find(
      f => f.name === `cat__customer_state_${customerData.customer_state}`
    );
    if (stateFeature) {
      contributions.push({
        name: `State: ${customerData.customer_state}`,
        value: stateFeature.weight,
        impact: stateFeature.weight > 0 ? 'increase' : 'decrease'
      });
    }

    // Sort by absolute value
    return contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 8);
  };

  const topContributions = getFeatureContributions();

  // Data for radial chart
  const chartData = [
    {
      name: 'Churn',
      value: churnProbability * 100,
      fill: churnProbability >= 0.7 ? '#ef4444' : churnProbability >= 0.4 ? '#f97316' : '#eab308'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Customer Churn Prediction Dashboard</h1>

        {/* Main Probability Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Churn Probability Card */}
          <div className={`${riskBgColor} border ${riskBorderColor} rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Churn Probability</h2>
              <AlertTriangle className={`${riskColor} w-6 h-6`} />
            </div>
            
            <div className="flex items-center justify-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  data={chartData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    fill={chartData[0].fill}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center mt-4">
              <div className={`text-5xl font-bold ${riskColor} mb-2`}>
                {churnPercentage}%
              </div>
              <div className="text-gray-600">
                Risk Level: <span className={`font-semibold ${riskColor}`}>{riskLevel}</span>
              </div>
            </div>
          </div>

          {/* Retention Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Key Metrics</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Churn Probability</span>
                  <span className={`font-bold ${riskColor}`}>{churnPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      churnProbability >= 0.7 ? 'bg-red-500' : 
                      churnProbability >= 0.4 ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${churnPercentage}%` }}
                  />
                </div>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Retention Probability</span>
                  <span className="font-bold text-green-600">{retentionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${retentionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Total Orders</span>
                  <span className="font-semibold">{customerData.frequency}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700">Lifetime Value</span>
                  <span className="font-semibold">${customerData.monetary.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Avg. Review Score</span>
                  <span className="font-semibold">{customerData.avg_review_score.toFixed(1)} / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Contributions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Contributing Factors</h2>
          <p className="text-sm text-gray-600 mb-6">
            Features that most influence the churn prediction for this customer
          </p>

          <div className="space-y-3">
            {topContributions.map((contribution, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-48 text-sm text-gray-700 font-medium">{contribution.name}</div>
                
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-6 rounded-full ${
                        contribution.impact === 'increase' ? 'bg-red-400' : 'bg-green-400'
                      }`}
                      style={{
                        width: `${Math.min(Math.abs(contribution.value) * 20, 100)}%`,
                      }}
                    />
                  </div>
                  
                  <div className="w-20 flex items-center gap-1">
                    {contribution.impact === 'increase' ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      contribution.impact === 'increase' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {contribution.value > 0 ? '+' : ''}{contribution.value.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Interpretation</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Positive values (red, trending up) increase churn risk</li>
              <li>• Negative values (green, trending down) decrease churn risk</li>
              <li>• Larger absolute values have stronger impact on the prediction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
