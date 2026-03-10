import joblib
import pandas as pd
import sys
import json

# Load the model once when the script starts
model = joblib.load('best_model_logreg.joblib')

def predict_churn(data):
    # Convert incoming JSON dictionary to DataFrame
    df = pd.DataFrame([data])
    
    # The pipeline automatically handles preprocessing (scaling, encoding)
    prediction = model.predict(df)
    probability = model.predict_proba(df)[0][1] # Probability of churn
    
    return {
        "churn": int(prediction[0]),
        "probability": float(probability)
    }

if __name__ == "__main__":
    # Example usage: read JSON from stdin
    input_data = json.load(sys.stdin)
    result = predict_churn(input_data)
    print(json.dumps(result))