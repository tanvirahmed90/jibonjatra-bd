import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { Hospital } from '../types';

/**
 * The map pulls in Leaflet + MapLibre GL (~1 MB of JavaScript) and vector tiles.
 * Loading it eagerly made the first page load very slow on mobile data.
 * This wrapper downloads the map code only when the map is about to scroll into view.
 */
const MapImpl = lazy(() => import('./Map').then(m => ({ default: m.Map })));

interface LazyMapProps {
  centerOnHospital?: Hospital | null;
  height?: string;
  /** Load immediately instead of waiting until the map scrolls into view */
  eager?: boolean;
}

export const Map: React.FC<LazyMapProps> = ({ eager = false, height = 'h-[460px] md:h-[540px]', ...rest }) => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (shouldLoad) return;
    const el = placeholderRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const placeholder = (
    <div
      ref={placeholderRef}
      className={`w-full ${height} rounded-2xl border border-slate-200/90 bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500`}
    >
      <span className="animate-pulse">🗺️ ম্যাপ লোড হচ্ছে…</span>
    </div>
  );

  if (!shouldLoad) return placeholder;

  return (
    <Suspense fallback={placeholder}>
      <MapImpl height={height} {...rest} />
    </Suspense>
  );
};
