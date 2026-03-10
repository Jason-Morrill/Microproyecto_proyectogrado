#!/usr/bin/env python3
import json
import sys
from pathlib import Path

import pandas as pd
from joblib import load


def main() -> int:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing model path argument"}))
        return 2

    model_path = Path(sys.argv[1])
    if not model_path.exists():
        print(json.dumps({"error": f"Model not found: {model_path}"}))
        return 3

    raw = sys.stdin.read().strip()
    if not raw:
        print(json.dumps({"error": "Empty input payload"}))
        return 4

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as err:
        print(json.dumps({"error": f"Invalid JSON payload: {err}"}))
        return 5

    required_cols = [
        "Recency",
        "Frequency",
        "Monetary",
        "avg_review_score",
        "avg_delivery_days",
        "avg_late_days",
        "avg_num_items",
        "avg_price_sum",
        "avg_freight_sum",
        "customer_state",
    ]

    missing = [col for col in required_cols if col not in payload]
    if missing:
        print(json.dumps({"error": f"Missing columns: {', '.join(missing)}"}))
        return 6

    try:
        model = load(model_path)
        X = pd.DataFrame([payload], columns=required_cols)
        proba = float(model.predict_proba(X)[0, 1])
    except Exception as err:  # noqa: BLE001
        print(json.dumps({"error": f"Prediction failed: {err}"}))
        return 7

    print(json.dumps({"churnProbability": proba}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
