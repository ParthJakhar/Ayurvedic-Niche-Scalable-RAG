import requests
from app.config.settings import OVERPASS_URL, RADIUS, RESULT_LIMIT
from app.utils.distance import haversine

def get_nearby_hospitals(lat, lon):
    query = f"""
    [out:json];
    node["amenity"="hospital"](around:{RADIUS},{lat},{lon});
    out;
    """

    headers = {
        "User-Agent": "HospitalTracker/1.0"
    }

    try:
        response = requests.post(
            OVERPASS_URL,
            data=query,
            headers=headers,
            timeout=10
        )

        print("Status Code:", response.status_code)

        if response.status_code != 200:
            print("Error Response:", response.text)
            return []

        data = response.json()

    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

    hospitals = []

    for h in data.get("elements", []):
        hospital_lat = h.get("lat")
        hospital_lon = h.get("lon")

        if not hospital_lat or not hospital_lon:
            continue

        distance = haversine(lat, lon, hospital_lat, hospital_lon)

        hospitals.append({
            "name": h.get("tags", {}).get("name", "Unknown Hospital"),
            "lat": hospital_lat,
            "lon": hospital_lon,
            "phone": h.get("tags", {}).get("phone"),
            "distance": distance,
            "maps_url": f"https://www.google.com/maps/search/?api=1&query={hospital_lat},{hospital_lon}"
        })

    hospitals.sort(key=lambda x: x["distance"])

    return hospitals[:RESULT_LIMIT]