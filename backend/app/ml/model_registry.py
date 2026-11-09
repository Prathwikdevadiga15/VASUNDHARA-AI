# Honest status of each model. Update `status` only after training AND evaluation.
MODELS = [
    {"name": "fire-risk", "version": "baseline-rules-v0", "status": "baseline (not trained)"},
    {"name": "water-anomaly", "version": "zscore-v0", "status": "statistical baseline"},
    {"name": "forest-change", "version": "ndvi-diff-v0", "status": "index arithmetic only"},
    {"name": "wildlife-yolo", "version": None, "status": "not implemented"},
    {"name": "audio-classifier", "version": None, "status": "not implemented"},
]
