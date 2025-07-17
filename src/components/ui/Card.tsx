import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'rounded-2xl border text-gray-900 dark:text-gray-50 transition-all duration-300 group',
  {
    variants: {
      variant: {
        default: 'border-gray-200/50 dark:border-gray-800/50 glass bg-white/80 dark:bg-gray-900/80 shadow-soft hover:shadow-medium backdrop-blur-xl',
        elevated: 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-1',
        glass: 'border-white/20 dark:border-gray-800/50 glass-primary backdrop-blur-xl shadow-lg hover:shadow-xl',
        'glass-dark': 'border-white/10 bg-black/20 backdrop-blur-xl text-white shadow-lg hover:shadow-xl',
        outline: 'border-2 border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600',
        gradient: 'border-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 shadow-lg hover:shadow-xl hover:from-primary/20 hover:via-accent/20 hover:to-primary/20',
        'gradient-border': 'gradient-border-animated bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl',
        soft: 'border-primary/20 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 hover:border-primary/30',
        interactive: 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer active:scale-[0.98]',
      },
      size: {
        default: '',
        sm: 'text-sm',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const cardHeaderVariants = cva(
  'flex flex-col space-y-2 transition-colors duration-300',
  {
    variants: {
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const cardContentVariants = cva(
  'transition-colors duration-300',
  {
    variants: {
      size: {
        default: 'p-6 pt-0',
        sm: 'p-4 pt-0',
        lg: 'p-8 pt-0',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const cardFooterVariants = cva(
  'flex items-center transition-colors duration-300',
  {
    variants: {
      size: {
        default: 'p-6 pt-0',
        sm: 'p-4 pt-0',
        lg: 'p-8 pt-0',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size }),
        hover && 'hover-lift',
        className
      )}
      {...props}
    >
      {children}
      {/* Subtle shine effect for glass variants */}
      {(variant === 'glass' || variant === 'glass-dark') && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  )
);
Card.displayName = 'Card';

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size }), className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    gradient?: boolean;
    size?: 'sm' | 'default' | 'lg' | 'xl';
  }
>(({ className, gradient = false, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: 'text-base font-semibold',
    default: 'text-lg font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-bold',
  };

  return (
    <h3
      ref={ref}
      className={cn(
        sizeClasses[size],
        'leading-none tracking-tight transition-colors duration-300',
        gradient && 'gradient-text',
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
  };

  return (
    <p
      ref={ref}
      className={cn(
        sizeClasses[size],
        'text-gray-600 dark:text-gray-400 transition-colors duration-300 text-balance',
        className
      )}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ size }), className)}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size }), className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

// Additional Card Components for enhanced functionality
const CardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
    warning: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
CardBadge.displayName = 'CardBadge';

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src: string;
    alt: string;
    aspectRatio?: 'square' | 'video' | 'wide';
  }
>(({ className, src, alt, aspectRatio = 'video', ...props }, ref) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-gray-800',
        aspectClasses[aspectRatio],
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
});
CardImage.displayName = 'CardImage';

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  CardBadge, 
  CardImage,
  cardVariants 
};
