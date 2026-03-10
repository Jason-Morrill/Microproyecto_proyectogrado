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
VENV_DIR="$APP_DIR/.venv"
REQUIREMENTS_FILE="$SERVER_DIR/requirements.txt"
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

if [ -d .git ]; then
  log "Pulling latest changes from git..."
  git pull --ff-only || log "git pull failed or no upstream; continuing with local code"
fi

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

if [ ! -d "$VENV_DIR" ]; then
  log "Creating Python virtual environment in: $VENV_DIR"
  python3 -m venv "$VENV_DIR"
fi

if [ ! -f "$REQUIREMENTS_FILE" ]; then
  echo "ERROR: requirements file not found: $REQUIREMENTS_FILE"
  exit 1
fi

log "Activating Python virtual environment..."
source "$VENV_DIR/bin/activate"

python -m pip install --upgrade pip
python -m pip install -r "$REQUIREMENTS_FILE"

# Ensure child processes (Node -> Python) resolve the venv interpreter first.
export PATH="$VENV_DIR/bin:$PATH"
export VIRTUAL_ENV="$VENV_DIR"

log "Starting backend with PM2..."
pm2 start "$SERVER_DIR/index.js" --name "$PROCESS_NAME" --update-env
pm2 save

log "Deploy complete. Process status:"
pm2 status "$PROCESS_NAME"

log "Useful commands:"
echo "  pm2 logs $PROCESS_NAME"
echo "  pm2 restart $PROCESS_NAME --update-env"
