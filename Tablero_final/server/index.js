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
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Replace with your EC2 Public IP
    fetch('http://44.197.200.83:3000/api/data') 
      .then(response => response.json())
      .then(json => setData(json));
  }, []);

  return (
    <div>
      <h1>Frontend App</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
app.post('/api/predict', (req, res) => {
  const prob = predict(req.body);
  res.json({ churnProbability: prob });
});
const express = require('express');
const path = require('path');


// Serve static files from the 'build' or 'dist' folder

// 1. Serve the static files from the Vite build
app.use(express.static(path.join(__dirname, '../dist')));

// 2. Your API routes
app.get('/api/status', (req, res) => {
  res.json({ message: "API is alive!" });
});

// 3. Hand everything else to the Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(3000, '0.0.0.0');