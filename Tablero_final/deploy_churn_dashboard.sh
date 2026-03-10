#!/usr/bin/env bash
set -euo pipefail

# Deploy script for Tablero_final + PM2 process churn_dashboard
# Usage:
#   bash Tablero_final/deploy_churn_dashboard.sh
# Optional:
#   REPO_DIR=/home/ubuntu/Microproyecto_proyectogrado bash Tablero_final/deploy_churn_dashboard.sh

REPO_DIR="${REPO_DIR:-$HOME/Microproyecto_proyectogrado}"
APP_DIR="$REPO_DIR/Tablero_final"
SERVER_DIR="$APP_DIR/server"
PROCESS_NAME="churn_dashboard"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "Starting deploy in: $APP_DIR"

if [ ! -d "$APP_DIR" ]; then
  echo "ERROR: App directory not found: $APP_DIR"
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "ERROR: pm2 is not installed. Install with: sudo npm i -g pm2"
  exit 1
fi

cd "$REPO_DIR"

log "Stopping existing PM2 process (if any): $PROCESS_NAME"
pm2 delete "$PROCESS_NAME" >/dev/null 2>&1 || true

log "Cleaning frontend artifacts..."
rm -rf "$APP_DIR/dist"

log "Installing frontend dependencies..."
cd "$APP_DIR"
npm install

log "Building frontend with Vite..."
npm run build

log "Installing backend dependencies..."
cd "$SERVER_DIR"
npm install

log "Installing required Python 3 libraries..."
if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 is not installed. Install it first (e.g. sudo apt install -y python3 python3-pip)"
  exit 1
fi

if ! python3 -m pip --version >/dev/null 2>&1; then
  echo "ERROR: pip for python3 is not available. Install it first (e.g. sudo apt install -y python3-pip)"
  exit 1
fi

python3 -m pip install --upgrade pip
python3 -m pip install pandas joblib scikit-learn

log "Starting backend with PM2..."
pm2 start "$SERVER_DIR/index.js" --name "$PROCESS_NAME"
pm2 save

log "Deploy complete. Process status:"
pm2 status "$PROCESS_NAME"

log "Useful commands:"
echo "  pm2 logs $PROCESS_NAME"
echo "  pm2 restart $PROCESS_NAME --update-env"
