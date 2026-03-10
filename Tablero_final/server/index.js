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
app.post('/api/predict', (req, res) => {
    try{
     writeLog('INFO', `Received prediction request with payload: ${JSON.stringify(req.body)}`);
    const pythonProcess = spawn('python3', ['predict_joblib.py']);
    writeLog('INFO', `Spawned Python process with PID: ${pythonProcess.pid}`);   
    pythonProcess.stdin.write(JSON.stringify(req.body));
    writeLog('INFO', `Sent data to Python process: ${JSON.stringify(req.body)}`);
    pythonProcess.stdin.end();
    writeLog('INFO', `Closed stdin for Python process with PID: ${pythonProcess.pid}`);
    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        try {
            const prediction = JSON.parse(dataString);
            writeLog('INFO', `Received prediction from Python process: ${JSON.stringify(prediction)}`);
            res.json(prediction);
        } catch (err) {
            writeLog('ERROR', `Error parsing prediction: ${err.message}`);
            res.status(500).send("Prediction failed");
        }
    });
    writeLog('PREDICT', `payload=${JSON.stringify(req.body)}`);
    res.json({ message: "Prediction success hola munndo" }); 
    } catch (err) {
        writeLog('ERROR', `Prediction error: ${err.message}`);
        res.status(500).send("Prediction failed");
    }
});

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.resolve(__dirname, '../dist')));
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

