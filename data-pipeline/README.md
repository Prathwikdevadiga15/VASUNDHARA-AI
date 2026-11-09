# Data pipeline
Scripts that pull real data. Nothing here generates fake observations.
- satellite/firms_fetch.py: NASA FIRMS active-fire hotspots (needs NASA_FIRMS_API_KEY)
- weather/openmeteo_fetch.py: forecasts for the pilot region
- biodiversity/gbif_fetch.py: occurrence records. Generalise coordinates of sensitive species before display.
- sensors/README.md: how ESP32 sensors should post readings (mark simulated ones `is_simulated = true`).
