// server/index.js
import express from 'express';
import cors from 'cors';
import modelWeights from '../imports/model_weights.json' with { type: 'json' };

const app = express();
app.use(cors());            // allow requests from your Vite app
app.use(express.json());

function predict(data) {
  let logit = modelWeights.intercept;
  const numFeatures = modelWeights.features.filter(f => f.name.startsWith('num__'));
  numFeatures.forEach(f => {
    const key = f.name.replace('num__', '');
    logit += f.weight * (data[key] || 0);
  });
  const stateFeature = modelWeights.features.find(
    f => f.name === `cat__customer_state_${data.customer_state}`
  );
  if (stateFeature) logit += stateFeature.weight;
  return 1 / (1 + Math.exp(-logit));
}

app.post('/api/predict', (req, res) => {
  const prob = predict(req.body);
  res.json({ churnProbability: prob });
});
app.get('/', (req, res) => {
  res.send('Hello! The server is running.');
});
app.listen(3000, () => console.log('API listening on http://localhost:3000'));