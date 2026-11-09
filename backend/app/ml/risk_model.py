"""Baseline fire-risk model.

This is a transparent weighted rule set, NOT a trained model. It exists so the API,
UI and alert pipeline can be built and tested end to end. Replace it with an XGBoost
model trained on labelled fire records (see ai-engine/predictions) and register the
new version in model_registry. Outputs must keep model_version and contributions.
"""
from app.schemas import FireRiskIn

MODEL_VERSION = "baseline-rules-v0"
WEIGHTS = {"temperature": 0.22, "low_humidity": 0.26, "wind": 0.14, "days_since_rain": 0.18, "dry_vegetation": 0.20}


def _n(x: float, lo: float, hi: float) -> float:
    return min(1.0, max(0.0, (x - lo) / (hi - lo)))


def fire_risk(f: FireRiskIn) -> dict:
    parts = {
        "temperature": WEIGHTS["temperature"] * _n(f.temperature_c, 15, 48),
        "low_humidity": WEIGHTS["low_humidity"] * (1 - _n(f.humidity_pct, 5, 100)),
        "wind": WEIGHTS["wind"] * _n(f.wind_kmh, 0, 60),
        "days_since_rain": WEIGHTS["days_since_rain"] * _n(f.days_since_rain, 0, 45),
        "dry_vegetation": WEIGHTS["dry_vegetation"] * (1 - _n(f.ndvi, 0.1, 0.8)),
    }
    score = round(sum(parts.values()), 3)
    band = "low" if score < 0.35 else "moderate" if score < 0.6 else "high"
    return {
        "score": score,
        "band": band,
        "contributions": {k: round(v, 3) for k, v in parts.items()},
        "model_version": MODEL_VERSION,
        "is_trained_model": False,
        "disclaimer": "Indicator for investigation only. Not an official fire alert.",
    }
