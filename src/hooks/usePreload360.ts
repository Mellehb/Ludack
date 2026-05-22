import { useEffect, useState } from 'react';

export type PreloadState = {
  loaded: number;
  total: number;
  ready: boolean;
};

export function usePreload360(frames: string[]): PreloadState {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (frames.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;
    let count = 0;

    frames.forEach((src) => {
      const img = new Image();
      const done = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
        if (count === frames.length) setReady(true);
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [frames]);

  return { loaded, total: frames.length, ready };
}
