// server/in
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());

// 1. API Route (The predict function should go here)
app.post('/api/predict', (req, res) => {
    // Keep your predict() function here
    // Keep your logic here
    res.json({ message: "Prediction success" }); 
});

// 2. Serve the static files from the 'dist' folder
// Note the path: '../dist' points one level up from your 'server' folder
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.resolve(__dirname, '../dist')));
// 3. Handle SPA routing (for React Router)
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

// 4. Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

