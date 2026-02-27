
export interface CustomerProfile {
  id: string;
  state: string;
  avg_delivery_time: number;
  recency: number; // days
  frequency: number; // orders
  monetary: number; // total spend
  churnProbability: number;
  drivers: { name: string; impact: string; value: string }[];
  segmentComparison: {
    metric: string;
    customerValue: number;
    segmentAvg: number;
    fullMark: number;
  }[];
}

export const MOCK_CUSTOMERS: CustomerProfile[] = [
  {
    id: "7c396fd4830fd04220f754e42b4e5bff",
    state: "SP",
    avg_delivery_time: 5.57,
    recency: 12,
    frequency: 4,
    monetary: 450.50,
    churnProbability: 0.15, // Low
    drivers: [
      { name: "Recency", impact: "positive", value: "12 días (Bajo)" },
      { name: "Frequency", impact: "positive", value: "4 pedidos (Alto)" },
      { name: "Review Score", impact: "positive", value: "4.8 avg" },
      { name: "Freight Value", impact: "neutral", value: "Normal" },
      { name: "Delivery Delay", impact: "positive", value: "0 días" },
    ],
    segmentComparison: [
      { metric: "Recency (días)", customerValue: 12, segmentAvg: 45, fullMark: 100 },
      { metric: "Frequency (#)", customerValue: 4, segmentAvg: 1.5, fullMark: 10 },
      { metric: "Monetary (R$)", customerValue: 450, segmentAvg: 120, fullMark: 1000 },
      { metric: "Satisfaction (1-5)", customerValue: 4.8, segmentAvg: 4.1, fullMark: 5 },
      { metric: "Delivery Time (días)", customerValue: 5, segmentAvg: 8, fullMark: 20 },
    ]
  },
  {
    id: "af07308b275d755c9edb36a90c618231",
    state: "RJ",
    cohort: "2017-Q1",
    category: "Electrónica",
    recency: 180,
    frequency: 1,
    monetary: 89.90,
    churnProbability: 0.88, // High
    drivers: [
      { name: "Recency", impact: "negative", value: "180 días (Muy Alto)" },
      { name: "Frequency", impact: "negative", value: "1 pedido" },
      { name: "Delivery Delay", impact: "negative", value: "7 días de retraso" },
      { name: "Review Score", impact: "negative", value: "1.0" },
      { name: "Payment Installments", impact: "neutral", value: "1x" },
    ],
    segmentComparison: [
      { metric: "Recency (días)", customerValue: 180, segmentAvg: 50, fullMark: 200 },
      { metric: "Frequency (#)", customerValue: 1, segmentAvg: 1.4, fullMark: 10 },
      { metric: "Monetary (R$)", customerValue: 89, segmentAvg: 150, fullMark: 1000 },
      { metric: "Satisfaction (1-5)", customerValue: 1, segmentAvg: 3.8, fullMark: 5 },
      { metric: "Delivery Time (días)", customerValue: 15, segmentAvg: 9, fullMark: 30 },
    ]
  },
  {
    id: "3a653a41f6f9fc3d2a113cf8398680e8",
    state: "MG",
    cohort: "2018-Q1",
    category: "Belleza y Salud",
    recency: 45,
    frequency: 2,
    monetary: 210.00,
    churnProbability: 0.45, // Medium
    drivers: [
      { name: "Recency", impact: "neutral", value: "45 días" },
      { name: "Frequency", impact: "positive", value: "2 pedidos" },
      { name: "Freight Ratio", impact: "negative", value: "Alto (25%)" },
      { name: "Category Churn", impact: "negative", value: "Alta rotación" },
      { name: "Delivery Time", impact: "positive", value: "A tiempo" },
    ],
    segmentComparison: [
      { metric: "Recency (días)", customerValue: 45, segmentAvg: 40, fullMark: 100 },
      { metric: "Frequency (#)", customerValue: 2, segmentAvg: 1.8, fullMark: 10 },
      { metric: "Monetary (R$)", customerValue: 210, segmentAvg: 180, fullMark: 1000 },
      { metric: "Satisfaction (1-5)", customerValue: 3, segmentAvg: 4.0, fullMark: 5 },
      { metric: "Delivery Time (días)", customerValue: 6, segmentAvg: 7, fullMark: 20 },
    ]
  }
];

// Distribution Data
export const DISTRIBUTION_DATA = Array.from({ length: 50 }, (_, i) => {
  const x = i / 50;
  // Bimodal distribution simulation (loyal vs churners)
  const y = Math.exp(-Math.pow(x - 0.2, 2) / 0.05) * 0.6 + Math.exp(-Math.pow(x - 0.85, 2) / 0.05) * 0.4;
  return { prob: (x * 100).toFixed(0), density: y * 100 };
});

// Cohort Data (Heatmap mock)
export const COHORT_DATA = [
  { cohort: "2017-01", m0: 100, m1: 45, m2: 38, m3: 35, m4: 32, m5: 30 },
  { cohort: "2017-02", m0: 100, m1: 42, m2: 36, m3: 33, m4: 30, m5: null },
  { cohort: "2017-03", m0: 100, m1: 48, m2: 40, m3: 38, m4: null, m5: null },
  { cohort: "2017-04", m0: 100, m1: 43, m2: 35, m3: null, m4: null, m5: null },
  { cohort: "2017-05", m0: 100, m1: 46, m2: null, m3: null, m4: null, m5: null },
];

// State Data
export const STATE_CHURN_DATA = [
  { state: "RR", churnRate: 65, customers: 120 },
  { state: "AL", churnRate: 58, customers: 450 },
  { state: "RJ", churnRate: 52, customers: 8500 },
  { state: "BA", churnRate: 48, customers: 2100 },
  { state: "SP", churnRate: 35, customers: 25000 },
  { state: "SC", churnRate: 32, customers: 3200 },
  { state: "MG", churnRate: 30, customers: 7800 },
];

// Scatter Data
export const SCATTER_DATA = Array.from({ length: 100 }, () => ({
  delay: Math.floor(Math.random() * 20) - 5, // -5 to 15 days delay
  churnProb: Math.random(),
  review: Math.floor(Math.random() * 5) + 1,
})).map(d => ({
  ...d,
  churnProb: Math.min(0.99, Math.max(0.01, (d.delay > 0 ? 0.5 : 0.2) + (5 - d.review) * 0.1 + Math.random() * 0.2))
}));
