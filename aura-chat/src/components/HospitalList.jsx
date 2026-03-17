import HospitalCard from './HospitalCard';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-card rounded-xl border border-border p-5 space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-3 w-1/3" />
    <div className="flex gap-2.5 pt-2">
      <Skeleton className="h-9 flex-1 rounded-lg" />
      <Skeleton className="h-9 flex-1 rounded-lg" />
    </div>
  </div>
);

const HospitalList = ({ hospitals, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-sage-bg flex items-center justify-center mb-4">
          <MapPin className="w-7 h-7 text-sage-text" />
        </div>
        <p className="text-muted-foreground text-sm">
          No hospitals found nearby
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          Try searching from a different location
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {hospitals.map((h, i) => (
        <HospitalCard key={`${h.name}-${i}`} hospital={h} index={i} />
      ))}
    </div>
  );
};

export default HospitalList;