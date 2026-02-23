#!/usr/bin/env bash
set -euo pipefail
sudo fuser -k 5000/tcp || true
pkill -f "mlflow server" || true
cd /home/ubuntu
mkdir -p /home/ubuntu/mlruns
source /home/ubuntu/venv/bin/activate
PUB_IP=$(curl -s ifconfig.me)
nohup mlflow server   --host 0.0.0.0 --port 5000   --workers 1   --backend-store-uri sqlite:////home/ubuntu/mlflow.db   --default-artifact-root /home/ubuntu/mlruns   --allowed-hosts "${PUB_IP}:5000,localhost:*"   --cors-allowed-origins "http://${PUB_IP}:5000"   > /home/ubuntu/mlflow.log 2>&1 &
echo "MLflow running at http://${PUB_IP}:5000"
