'use client';

import { forwardRef, HTMLAttributes } from 'react';

interface NeoCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'small' | 'inset';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const NeoCard = forwardRef<HTMLDivElement, NeoCardProps>(
  ({ className = '', variant = 'default', padding = 'lg', children, ...props }, ref) => {
    const variantClass =
      variant === 'small'
        ? 'neo-card-sm'
        : variant === 'inset'
        ? 'neo-inset'
        : 'neo-card';

    return (
      <div
        ref={ref}
        className={`${variantClass} ${paddingClasses[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeoCard.displayName = 'NeoCard';

export { NeoCard };
