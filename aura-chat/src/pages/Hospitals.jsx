import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Locate, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import HospitalList from '@/components/HospitalList';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);

  const fetchHospitals = useCallback((lat, lon) => {
    setIsLoading(true);
    setError(null);
    setCoords({ lat, lon });

    fetch(`http://localhost:9000/api/hospitals?lat=${lat}&lon=${lon}`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch hospitals');
        return res.json();
      })
      .then((data) => {
        setHospitals(data);
        setHasFetched(true);
      })
      .catch(() => {
        setError('Could not fetch nearby hospitals. Please try again.');
        setHasFetched(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleFindHospitals = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        fetchHospitals(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError('Location access denied. Please enable location services.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleEmergency = () => {
    if (hospitals.length > 0) {
      const nearest = hospitals[0];
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lon}`,
        '_blank'
      );
    } else if (coords) {
      window.open(
        `https://www.google.com/maps/search/hospital/@${coords.lat},${coords.lon},14z`,
        '_blank'
      );
    } else {
      handleFindHospitals();
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="max-w-[800px] mx-auto flex items-center gap-3 px-5 py-3.5">
          <Link
            to="/"
            className="w-8 h-8 rounded-full bg-sage-bg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <h1 className="font-display text-xl font-semibold text-foreground tracking-tight">
              Nearby Hospital Tracker
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Find hospitals near you instantly
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-5 py-8">
        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <button
            onClick={handleFindHospitals}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-forest-hover disabled:opacity-60 transition-colors duration-200 shadow-[var(--shadow-sm)]"
          >
            <Locate className="w-4.5 h-4.5" />
            {isLoading ? 'Locating…' : 'Find Nearby Hospitals'}
          </button>

          <button
            onClick={handleEmergency}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-medium text-sm hover:brightness-110 transition-all duration-200 shadow-[var(--shadow-sm)]"
          >
            <AlertTriangle className="w-4.5 h-4.5" />
            🚨 Emergency
          </button>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Map placeholder */}
        {hasFetched && hospitals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 rounded-xl border border-border bg-sage-bg overflow-hidden"
          >
            <div className="flex items-center justify-center h-40 text-sage-text text-sm gap-2">
              <MapPin className="w-5 h-5" />
              Map preview — {hospitals.length} hospital
              {hospitals.length !== 1 && 's'} found
            </div>
          </motion.div>
        )}

        {/* Results */}
        {(isLoading || hasFetched) && (
          <HospitalList hospitals={hospitals} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
};

export default Hospitals;