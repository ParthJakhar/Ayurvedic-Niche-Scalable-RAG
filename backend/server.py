from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "Backend service is up"}


@app.get("/stores")
async def get_stores(lat: float, lng: float):
    query = (
        f"[out:json];"
        f'('
        f'node["shop"="herbal"](around:30000,{lat},{lng});'
        f'node["name"~"ayurveda|ayurvedic|patanjali",i](around:30000,{lat},{lng});'
        f'node["description"~"ayurveda",i](around:30000,{lat},{lng});'
        f');out;'
    )

    try:
        headers = {"User-Agent": "AyurvedaStoreLocator/1.0"}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://overpass-api.de/api/interpreter",
                data={"data": query},
                headers=headers,
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()

        stores = []
        seen_names = set()
        for element in data.get("elements", []):
            tags = element.get("tags", {})
            name = tags.get("name")
            if not name:
                continue

            lat_el = element.get("lat")
            lon_el = element.get("lon")
            if lat_el is None or lon_el is None:
                continue

            lowered = name.lower()
            if lowered in seen_names:
                continue
            seen_names.add(lowered)
            stores.append(
                {
                    "name": name,
                    "latitude": lat_el,
                    "longitude": lon_el,
                }
            )

        return stores[:20]
    except Exception as e:
        print(f"Error fetching stores: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch nearby stores")
