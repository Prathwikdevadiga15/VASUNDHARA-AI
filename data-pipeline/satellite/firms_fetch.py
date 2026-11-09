import os
import sys

import httpx

# Western Ghats, Karnataka pilot bounding box: west,south,east,north
AREA = "74.0,11.5,76.5,15.0"
key = os.environ["NASA_FIRMS_API_KEY"]
days = sys.argv[1] if len(sys.argv) > 1 else "1"
url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{key}/VIIRS_SNPP_NRT/{AREA}/{days}"
r = httpx.get(url, timeout=60)
r.raise_for_status()
print(r.text)  # next step: parse rows and create UNVERIFIED alerts via notification_service
