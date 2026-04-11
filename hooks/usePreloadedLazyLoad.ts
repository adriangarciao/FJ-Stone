import { useEffect, useRef, useState } from 'react';

interface UsePreloadedLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  skip?: boolean;
}

export function usePreloadedLazyLoad<T extends HTMLElement>({
  rootMargin = '800px 0px',
  threshold = 0,
  skip = false,
}: UsePreloadedLazyLoadOptions = {}) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(skip);

  useEffect(() => {
    if (skip) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, skip]);

  return { ref, isInView };
}
