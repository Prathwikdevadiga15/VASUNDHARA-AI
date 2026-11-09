import numpy as np

from app.ml.risk_model import fire_risk
from app.ml.water_model import zscore_anomalies
from app.schemas import FireRiskIn
from app.services.satellite_service import ndvi, ndvi_change


def test_fire_risk_monotonic_and_labelled():
    hot = fire_risk(FireRiskIn(temperature_c=45, humidity_pct=10, wind_kmh=40, days_since_rain=30, ndvi=0.2))
    cool = fire_risk(FireRiskIn(temperature_c=22, humidity_pct=90, wind_kmh=5, days_since_rain=1, ndvi=0.8))
    assert hot["score"] > cool["score"]
    assert hot["is_trained_model"] is False and "contributions" in hot


def test_ndvi_values():
    assert abs(ndvi(np.array([0.8]), np.array([0.2]))[0] - 0.6) < 1e-9
    assert ndvi(np.array([0.0]), np.array([0.0]))[0] == 0


def test_ndvi_change_detects_loss():
    before, after = np.full((4, 4), 0.7), np.full((4, 4), 0.7)
    after[0, :] = 0.2
    assert ndvi_change(before, after)["pixels"] == 4


def test_water_anomaly():
    series = [7.0] * 20 + [11.5]
    assert zscore_anomalies(series, 3.0)["anomaly_indices"] == [20]


def test_chat_refuses_without_sources(client, db):
    from app.tests.conftest import login, make_user
    make_user(db, "c@x.in", "citizen")
    login(client, "c@x.in")
    r = client.post("/api/v1/chat", json={"question": "How much forest was lost last year?"})
    assert r.json()["citations"] == [] and "No verified sources" in r.json()["answer"]


def test_unimplemented_modules_say_so(client):
    assert client.post("/api/v1/wildlife/identify").status_code == 501
