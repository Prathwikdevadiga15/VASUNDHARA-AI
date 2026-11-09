import httpx

r = httpx.get("https://api.open-meteo.com/v1/forecast", params={
    "latitude": 13.0, "longitude": 75.2, "hourly": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation"}, timeout=30)
r.raise_for_status()
print(r.json()["hourly"].keys())
