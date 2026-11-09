# VASUNDHARA AI – AI & Machine Learning Architecture

**Mission:** Proactive Ecological Threat Detection & Biodiversity Preservation  
**Pilot Zone:** Western Ghats Biodiversity Hotspot (Karnataka, India)

---

## 1. Multi-Model AI Ecosystem

```
+-------------------------------------------------------------------------+
|                         AI & ML ORCHESTRATION                           |
+-------------------------------------------------------------------------+
         |                     |                     |
         v                     v                     v
+------------------+  +------------------+  +------------------+
| COMPUTER VISION  |  | GEOSPATIAL / CV  |  | PREDICTIVE ML    |
| Fauna Classifier |  | NDVI Multispect. |  | XGBoost / Forest |
| (Western Ghats)  |  | Canopy Loss Det. |  | Fire Risk Engine |
+------------------+  +------------------+  +------------------+
         |                     |                     |
         v                     v                     v
+------------------+  +------------------+  +------------------+
| BIOACOUSTICS     |  | ANOMALY DETECT.  |  | LLM COPILOT / RAG|
| Audio Classifier |  | Rolling Z-Score  |  | Gemini 2.5 Flash |
| Chainsaw / Shot  |  | Water Pollution  |  | Grounded Citings |
+------------------+  +------------------+  +------------------+
```

---

## 2. Specialized Models & Capabilities

### 2.1 Western Ghats Wildlife Species Classifier (`ai-engine/computer-vision`)
- **Target Taxa:**
  - *Panthera tigris* (Bengal Tiger - Endangered)
  - *Elephas maximus* (Asian Elephant - Endangered)
  - *Macaca silenus* (Lion-tailed Macaque - Endangered endemic)
  - *Nilgiritragus hylocrius* (Nilgiri Tahr - Endangered endemic)
  - *Buceros bicornis* (Great Indian Hornbill - Vulnerable)
  - *Ratufa indica* (Malabar Giant Squirrel - Least Concern / Keystone)
  - *Ophiophagus hannah* (King Cobra - Vulnerable)
  - *Panthera pardus* (Indian Leopard - Vulnerable)
- **Architecture:** PyTorch / OpenCV convolutional feature extraction & species taxonomy classification with bounding box localization simulation, confidence grading (0.0 to 1.0), and IUCN Red List metadata.

### 2.2 Satellite Multispectral Forest Change Detection (`ai-engine/forest_detection`)
- **Formula:** Normalized Difference Vegetation Index (NDVI)
  $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$
- **Change Detection Engine:**
  $$\Delta \text{NDVI} = \text{NDVI}_{\text{after}} - \text{NDVI}_{\text{before}}$$
- Pixels where $\Delta \text{NDVI} < -0.20$ are classified as candidate deforestation zones.
- Cross-validation against cloud cover percentages and spatial clustering to prevent false positives from agricultural harvests.

### 2.3 Explainable Fire-Risk Engine (`ai-engine/predictions`)
- **Inputs:**
  1. Surface Temperature ($T$ in °C)
  2. Relative Humidity ($H$ in %)
  3. Wind Speed ($W$ in km/h)
  4. Consecutive Dry Days ($D$)
  5. Mean Canopy NDVI
- **Output:** Risk Index $\in [0, 1]$ categorized into `Low`, `Medium`, `High`, `Critical`.
- **Explainability (SHAP / Feature Attribution):** Decomposes the aggregate risk into percentage factor weights, providing forest rangers with the exact causal drivers (e.g., "78% risk driven by 32 dry days and 42°C temp").

### 2.4 Forest Bioacoustic Threat Detection (`ai-engine/audio_classification`)
- **Audio Signatures:**
  - Chainsaw engine acoustic harmonics (illegal logging indicator).
  - High-decibel impulse transients (gunshot / poaching alert).
  - Deer & langur alarm calls (predator or intruder presence).
- **Inference Pipeline:** Spectral feature transform and acoustic signature classification generating automated perimeter warnings.

### 2.5 Water Pollution Anomaly Detection (`ai-engine/water_prediction`)
- **Parameters:** pH, Dissolved Oxygen (mg/L), Turbidity (NTU), Temperature (°C).
- **Model:** Rolling Z-score anomaly detector:
  $$Z = \frac{|x - \mu|}{\sigma}$$
- Flags point-source industrial or sewage discharge in Western Ghats river basins.

### 2.6 LLM Environmental Copilot & RAG (`ai-engine/rag`)
- **Primary Model:** Google Gemini API (`gemini-2.5-flash`)
- **Grounding Corpus:**
  - India State of Forest Report (ISFR 2023)
  - Wildlife Protection Act 1972 & 2022 amendments
  - Western Ghats Ecology Expert Panel (Madhav Gadgil & Kasturirangan reports)
- **Constraint:** Zero-hallucination prompt formatting. If no verified evidence is retrieved, the assistant explicitly states the lack of documentation rather than confabulating statistics.

