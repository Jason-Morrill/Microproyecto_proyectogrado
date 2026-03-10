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

function classifyRequestSource(userAgent) {
    const ua = String(userAgent || '').toLowerCase();

    if (
        ua.includes('elb-healthchecker') ||
        ua.includes('healthchecker') ||
        ua.includes('kube-probe') ||
        ua.includes('route53')
    ) {
        return 'health-check';
    }

    if (ua.startsWith('curl/')) {
        return 'curl';
    }

    if (
        ua.includes('mozilla') ||
        ua.includes('chrome') ||
        ua.includes('safari') ||
        ua.includes('firefox') ||
        ua.includes('edg/') ||
        ua.includes('opr/')
    ) {
        return 'browser';
    }

    return 'api-client';
}

app.use((req, res, next) => {
    const startMs = Date.now();

    res.on('finish', () => {
        const durationMs = Date.now() - startMs;
        const forwardedFor = req.headers['x-forwarded-for'];
        const forwardedIp = Array.isArray(forwardedFor)
            ? forwardedFor[0]
            : (forwardedFor || '').split(',')[0].trim();
        const clientIp = forwardedIp || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        const source = classifyRequestSource(userAgent);
        writeLog(
            'HTTP',
            `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms source=${source} ip=${clientIp} ua="${userAgent}"`
        );
    });

    next();
});

app.use(express.json());
import { spawn } from 'child_process';
const MODEL_PATH = path.resolve(__dirname, 'best_model_logreg.joblib');
const VENV_PYTHON = path.resolve(__dirname, '.venv/bin/python');

app.post('/api/predict', (req, res) => {
    try {
        const sendJson = (statusCode, body) => {
            if (res.headersSent) {
                writeLog('WARN', `Skipped duplicate response status=${statusCode} body=${JSON.stringify(body)}`);
                return;
            }
            res.status(statusCode).json(body);
        };

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
        console.log('INFO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Received prediction request >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log(`INFO <<<<<<<< path to env >>>>>>>: ${VENV_PYTHON}`);
        console.log(`Received prediction request with payload: ${JSON.stringify(payload)}`);   
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
                sendJson(500, { error: 'Prediction failed' });
                return;
            }

            try {
                const prediction = JSON.parse(dataString);
                const proba = prediction.churnProbability;
                writeLog('INFO', `Received prediction from Python process: ${JSON.stringify(prediction)}`);
                writeLog('INFO', `proba=${proba}`);
                console.log(`proba=${proba}`);
                writeLog('PREDICT', `payload=${JSON.stringify(payload)}`);
                sendJson(200, prediction);
                return;
            } catch (err) {
                writeLog('ERROR', `Error parsing prediction: ${err.message}. Raw: ${dataString}`);
                sendJson(500, { error: 'Invalid prediction response' });
                return;
            }
        });

        pythonProcess.on('error', (err) => {
            writeLog('ERROR', `Python process spawn error: ${err.message}`);
            sendJson(500, { error: 'Prediction process error' });
        });

        pythonProcess.stdin.write(JSON.stringify(payload));
        pythonProcess.stdin.end();
    } catch (err) {
        writeLog('ERROR', `Prediction error: ${err.message}`);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Prediction failed' });
        }
        return;
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




