import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

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
