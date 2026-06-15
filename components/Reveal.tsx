'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';

type Variant = 'up' | 'left' | 'scale';

// Initial (hidden) transform per variant — mirrors the previous framer-motion values.
const HIDDEN_TRANSFORM: Record<Variant, string> = {
  up: 'translateY(20px)',
  left: 'translateX(-20px)',
  scale: 'scale(0.95)',
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger/entrance delay in seconds. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  variant?: Variant;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  /** IntersectionObserver rootMargin — negative values delay the trigger. */
  margin?: string;
}

/**
 * Lightweight, dependency-free scroll-reveal wrapper.
 * Replaces framer-motion's `whileInView` fade/slide on the marketing pages so
 * the route bundle no longer ships the animation library. Animates once when
 * the element first enters the viewport, then disconnects.
 *
 * Reduced-motion is handled in globals.css via `[data-reveal]` — users with
 * that preference get fully-visible content with no transition.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  variant = 'up',
  as: Tag = 'div',
  margin = '0px',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : HIDDEN_TRANSFORM[variant],
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
        transitionDelay: `${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
