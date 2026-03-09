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
const express = require('express');
const path = require('path');


// Serve static files from the 'build' or 'dist' folder
app.use(express.static(path.join(__dirname, '../client/build')));

// Any other route should serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.listen(3000, () => console.log('API listening on http://localhost:3000'));