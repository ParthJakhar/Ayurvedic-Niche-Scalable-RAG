import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2, MapPinOff } from 'lucide-react';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

function storesFetchUrl(latitude, longitude) {
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
  });
  if (import.meta.env.DEV) {
    return `/api/stores?${params}`;
  }
  const base = (
    import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'
  ).replace(/\/$/, '');
  return `${base}/stores?${params}`;
}

const StoreLocator = () => {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        try {
          const response = await fetch(storesFetchUrl(latitude, longitude));
          if (!response.ok) {
            let detail = '';
            try {
              const body = await response.json();
              detail =
                typeof body?.detail === 'string'
                  ? body.detail
                  : Array.isArray(body?.detail)
                    ? body.detail.map((d) => d.msg || d).join(', ')
                    : '';
            } catch {
              /* ignore */
            }
            throw new Error(detail || `Server returned ${response.status}`);
          }
          const data = await response.json();
          setStores(Array.isArray(data) ? data : []);
        } catch (err) {
          const msg =
            err instanceof TypeError
              ? 'Cannot reach the backend. Start the API from the backend folder (python main.py) and reload.'
              : err instanceof Error && err.message
                ? err.message
                : 'Unknown error';
          setError(
            `Could not load nearby stores (${msg}). If it keeps failing, Overpass may be slow — try again in a minute.`,
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied. Please allow location access to find nearby stores.');
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Locating you and finding nearby Ayurvedic stores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full text-destructive text-center p-6">
        <MapPinOff className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!location) return null;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
      <MapContainer 
        center={[location.lat, location.lng]} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterAutomatically lat={location.lat} lng={location.lng} />

        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div className="font-semibold text-primary">You are here</div>
          </Popup>
        </Marker>

        {stores.map((store, idx) => (
          <Marker key={idx} position={[store.latitude, store.longitude]}>
            <Popup>
              <div className="font-medium">{store.name}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StoreLocator;
