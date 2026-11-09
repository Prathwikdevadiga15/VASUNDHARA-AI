import httpx

r = httpx.get("https://api.gbif.org/v1/occurrence/search", params={"country": "IN", "limit": 20}, timeout=30)
r.raise_for_status()
for o in r.json()["results"]:
    print(o.get("scientificName"), o.get("decimalLatitude"), o.get("decimalLongitude"))
