# AI engine
Training and evaluation code, kept separate from the API so heavy jobs never slow the website.

| Folder | Purpose | Status |
|---|---|---|
| predictions/ | XGBoost fire-risk training with SHAP | train_fire_risk.py (needs labelled data) |
| computer-vision/ | YOLO wildlife detection | not started |
| embeddings/ | Chunk and embed documents into pgvector | ingest_documents.py |
| rag/ | Retrieval evaluation set | eval_set.example.json |
| evaluation/ | Metrics reports saved to model_registry | not started |

A model is only marked active in `model_registry` after evaluation metrics are recorded.
