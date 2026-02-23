# MLflow en AWS EC2 (Tracking Server)

## Objetivo
Desplegar MLflow en EC2 y capturar evidencias requeridas (usuario+IP en EC2 e IP en la UI).

## Comandos (EC2)
```bash
sudo fuser -k 5000/tcp || true
pkill -f "mlflow server" || true

cd /home/ubuntu
mkdir -p /home/ubuntu/mlruns
source /home/ubuntu/venv/bin/activate

PUB_IP=$(curl -s ifconfig.me)

nohup mlflow server \
  --host 0.0.0.0 --port 5000 \
  --workers 1 \
  --backend-store-uri sqlite:////home/ubuntu/mlflow.db \
  --default-artifact-root /home/ubuntu/mlruns \
  --allowed-hosts "${PUB_IP}:5000,localhost:*" \
  --cors-allowed-origins "http://${PUB_IP}:5000" \
  > /home/ubuntu/mlflow.log 2>&1 &
```

## Security Group (Inbound)
- TCP 22 desde tu IP
- TCP 5000 desde tu IP

## Evidencias a guardar (en repo)
- report/evidence/aws/EVID_AWS_01_ec2_whoami_ip.png
- report/evidence/mlflow/EVID_MLFLOW_01_ui_ip.png
- report/evidence/mlflow/EVID_MLFLOW_02_runs_list.png
- report/evidence/mlflow/EVID_MLFLOW_03_compare.png
- report/evidence/mlflow/EVID_MLFLOW_04_best_run_detail_params_metrics.png
- report/evidence/mlflow/EVID_MLFLOW_04_best_run_detail_artifacts.png
