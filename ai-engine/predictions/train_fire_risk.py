"""Train the fire-risk model. Needs a CSV with columns:
temperature_c, humidity_pct, wind_kmh, days_since_rain, ndvi, fire_occurred (0/1)
Build it from NASA FIRMS hotspots joined with weather and NDVI. No synthetic labels."""
import sys

import pandas as pd
import shap
import xgboost as xgb
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split

FEATURES = ["temperature_c", "humidity_pct", "wind_kmh", "days_since_rain", "ndvi"]

df = pd.read_csv(sys.argv[1])
X_tr, X_te, y_tr, y_te = train_test_split(df[FEATURES], df["fire_occurred"], test_size=0.2, stratify=df["fire_occurred"], random_state=42)
model = xgb.XGBClassifier(n_estimators=300, max_depth=4, learning_rate=0.05).fit(X_tr, y_tr)
print("ROC AUC:", roc_auc_score(y_te, model.predict_proba(X_te)[:, 1]))
shap.TreeExplainer(model).shap_values(X_te)  # use for per-prediction explanations
model.save_model("fire_risk_xgb.json")
