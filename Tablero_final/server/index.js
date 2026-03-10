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
const MODEL_PATH = path.resolve(__dirname, 'best_model_logreg.joblib');
const VENV_PYTHON = path.resolve(__dirname, '../.venv/bin/python');

app.post('/api/predict', (req, res) => {
    try {
        const payload = {
            Recency: req.body.Recency ?? req.body.recency,
            Frequency: req.body.Frequency ?? req.body.frequency,
            Monetary: req.body.Monetary ?? req.body.monetary,
            avg_review_score: req.body.avg_review_score,
            avg_delivery_days: req.body.avg_delivery_days,
            avg_late_days: req.body.avg_late_days,
            avg_num_items: req.body.avg_num_items,
            avg_price_sum: req.body.avg_price_sum,
            avg_freight_sum: req.body.avg_freight_sum,
            customer_state: req.body.customer_state,
        };
        writeLog('INFO', `path to env: ${VENV_PYTHON}`);
        writeLog('INFO', `Received prediction request with payload: ${JSON.stringify(payload)}`);
        const pythonProcess = spawn(VENV_PYTHON, ['predict_joblib.py', MODEL_PATH], {
            cwd: __dirname,
            env: process.env,
        });
        writeLog('INFO', `Spawned Python process with PID: ${pythonProcess.pid}`);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (errorString) {
                writeLog('ERROR', `Python stderr: ${errorString.trim()}`);
            }

            if (code !== 0) {
                writeLog('ERROR', `Python process exited with code ${code}. Output: ${dataString}`);
                return res.status(500).json({ error: 'Prediction failed' });
            }

            try {
                const prediction = JSON.parse(dataString);
                const proba = prediction.churnProbability;
                writeLog('INFO', `Received prediction from Python process: ${JSON.stringify(prediction)}`);
                writeLog('INFO', `proba=${proba}`);
                console.log(`proba=${proba}`);
                writeLog('PREDICT', `payload=${JSON.stringify(payload)}`);
                return res.json(prediction);
            } catch (err) {
                writeLog('ERROR', `Error parsing prediction: ${err.message}. Raw: ${dataString}`);
                return res.status(500).json({ error: 'Invalid prediction response' });
            }
        });

        pythonProcess.stdin.write(JSON.stringify(payload));
        pythonProcess.stdin.end();
    } catch (err) {
        writeLog('ERROR', `Prediction error: ${err.message}`);
        return res.status(500).json({ error: 'Prediction failed' });
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

