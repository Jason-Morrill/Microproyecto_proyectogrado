// server/in
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'server.log');

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

function writeLog(level, message) {
    const timestamp = new Date().toISOString();
    logStream.write(`[${timestamp}] [${level}] ${message}\n`);
}

app.use((req, res, next) => {
    const startMs = Date.now();

    res.on('finish', () => {
        const durationMs = Date.now() - startMs;
        writeLog('HTTP', `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
    });

    next();
});

app.use(express.json());
import { spawn } from 'child_process';
// 1. API Route (The predict function should go here)
app.post('/api/predict', (req, res) => {
    // Keep your predict() function here
    // Keep your logic here
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        try {
            const prediction = JSON.parse(dataString);
            res.json(prediction);
        } catch (err) {
            res.status(500).send("Prediction failed");
        }
    });
    writeLog('PREDICT', `payload=${JSON.stringify(req.body)}`);
    res.json({ message: "Prediction success hola munndo" }); 
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
    writeLog('INFO', `Server running on port ${PORT}`);
    writeLog('INFO', `Log file ready at ${LOG_FILE}`);
});

