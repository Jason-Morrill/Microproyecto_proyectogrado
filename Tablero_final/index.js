// server/index.js
import express from 'express';
import modelWeights from './model_weights.json';

const app = express();
app.use(express.json());

function predict(data) {
  let logit = modelWeights.intercept;
  // … replicate the same math you had in App.tsx …
  // (numerical features + state weight, then sigmoid)
  return 1 / (1 + Math.exp(-logit));
}

app.post('/api/predict', (req, res) => {
  const customer = req.body;
  const prob = predict(customer);
  res.json({ churnProbability: prob });
});

app.listen(3000, () => console.log('API listening on :3000'));