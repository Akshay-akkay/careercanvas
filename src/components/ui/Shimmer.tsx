import { cn } from '../../lib/utils';
import React from 'react';

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'span';
}

/**
 * A lightweight shimmering skeleton placeholder.
 *
 * Usage:
 *   <Shimmer className="h-4 w-full rounded-md" />
 */
export const Shimmer: React.FC<ShimmerProps> = ({ as = 'div', className, ...props }) => {
  const Comp = as;
  return (
    <Comp
      aria-hidden
      {...props}
      className={cn('relative overflow-hidden bg-gray-200 dark:bg-gray-700/40', className)}
    >
      <div className="absolute inset-0 bg-gradient-shine animate-shimmer" />
    </Comp>
  );
};

Shimmer.displayName = 'Shimmer'; 