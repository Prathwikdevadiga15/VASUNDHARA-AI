import numpy as np


def zscore_anomalies(values: list[float], threshold: float = 3.0) -> dict:
    """Flag points far from the series mean. Simple statistical baseline for sensor QA."""
    a = np.asarray(values, dtype=float)
    sd = float(a.std())
    if sd == 0:
        return {"anomaly_indices": [], "mean": float(a.mean()), "std": 0.0}
    z = np.abs((a - a.mean()) / sd)
    return {"anomaly_indices": np.where(z > threshold)[0].tolist(), "mean": float(a.mean()), "std": sd}
