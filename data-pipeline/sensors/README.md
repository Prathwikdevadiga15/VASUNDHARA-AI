ESP32 sensors send JSON `{station_id, ph, turbidity_ntu, temperature_c, measured_at}` over HTTPS (or MQTT to a bridge)
with a per-device key. The ingest endpoint is not built yet. Simulated readings must set `is_simulated = true`
and be labelled on screen.
