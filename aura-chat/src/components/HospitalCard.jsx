import { motion } from 'framer-motion';
import { Phone, MapPin, Navigation } from 'lucide-react';

const HospitalCard = ({ hospital, index }) => {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lon}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-[15px] leading-snug truncate">
            {hospital.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-sage-text flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              {hospital.distance ? hospital.distance.toFixed(1) : "N/A"} km away
            </span>
          </div>

          {hospital.phone && (
            <div className="flex items-center gap-1.5 mt-1">
              <Phone className="w-3.5 h-3.5 text-sage-text flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                {hospital.phone}
              </span>
            </div>
          )}
        </div>

        <div className="w-10 h-10 rounded-full bg-sage-bg flex items-center justify-center flex-shrink-0">
          <Navigation className="w-4.5 h-4.5 text-primary" />
        </div>
      </div>

      <div className="flex gap-2.5 mt-4">
        {hospital.phone && (
          <a
            href={`tel:${hospital.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sage-bg text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-forest-hover transition-colors duration-200"
        >
          <MapPin className="w-3.5 h-3.5" />
          Directions
        </a>
      </div>
    </motion.div>
  );
};

export default HospitalCard;