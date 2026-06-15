import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom has no IntersectionObserver. Mock it to report immediate intersection so
// the Reveal component (and anything else using it) renders its content visible.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

vi.mock('next/link', () => {
  return {
    default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
      React.createElement('a', { href, ...props }, children),
  };
});

vi.mock('framer-motion', async () => {
  const ReactImport = await import('react');
  const motionPropKeys = new Set([
    'animate',
    'initial',
    'transition',
    'viewport',
    'whileHover',
    'whileInView',
    'whileTap',
  ]);
  const stripMotionProps = (props: React.HTMLAttributes<HTMLElement>) =>
    Object.fromEntries(
      Object.entries(props).filter(([key]) => !motionPropKeys.has(key))
    );
  const motion = new Proxy(
    {},
    {
      get: (_, tag) => {
        return ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
          ReactImport.createElement(
            tag as string,
            stripMotionProps(props),
            children
          );
      },
    }
  );

  return {
    motion,
    useInView: () => true,
  };
});
