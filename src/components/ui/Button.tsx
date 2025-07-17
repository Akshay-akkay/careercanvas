import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-primary to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]',
        primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]',
        accent: 'bg-gradient-to-r from-accent to-accent-600 text-black hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02]',
        success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02]',
        warning: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02]',
        outline: 'border-2 border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800/50 dark:hover:text-gray-50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md',
        'outline-primary': 'border-2 border-primary/30 bg-transparent text-primary hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20',
        secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800/50 dark:hover:text-gray-50 hover:shadow-sm',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto font-medium',
        gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_200%] animate-gradient-shift text-white hover:opacity-90 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]',
        'gradient-accent': 'bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-shift text-white hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]',
        glass: 'glass-primary text-white hover:bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02]',
        'glass-dark': 'bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-black/30 hover:border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02]',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary-700 dark:hover:text-primary-300 border border-primary/20 hover:border-primary/30 hover:shadow-md',
        elevated: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-lg px-4 text-xs font-medium',
        lg: 'h-13 rounded-2xl px-8 text-base font-semibold',
        xl: 'h-16 rounded-2xl px-10 text-lg font-bold',
        icon: 'h-11 w-11 rounded-xl',
        'icon-sm': 'h-9 w-9 rounded-lg',
        'icon-lg': 'h-13 w-13 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const shimmerVariants = cva(
  'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
        primary: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
        accent: 'bg-gradient-to-r from-transparent via-black/10 to-transparent',
        destructive: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
        success: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
        warning: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
        outline: 'bg-gradient-to-r from-transparent via-gray-200/50 to-transparent',
        'outline-primary': 'bg-gradient-to-r from-transparent via-primary/10 to-transparent',
        secondary: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
        ghost: 'bg-gradient-to-r from-transparent via-gray-200/50 to-transparent',
        gradient: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
        'gradient-accent': 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
        glass: 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
        'glass-dark': 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
        soft: 'bg-gradient-to-r from-transparent via-primary/10 to-transparent',
        elevated: 'bg-gradient-to-r from-transparent via-gray-200/50 to-transparent',
        link: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  shimmer?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, shimmer = true, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    // When using asChild, we need to pass only the children without additional wrapper elements
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect */}
        {shimmer && variant !== 'link' && (
          <div className={cn(shimmerVariants({ variant }))}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 -skew-x-12 animate-shimmer" />
          </div>
        )}
        
        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Ripple effect container */}
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-active:translate-x-[100%] transition-transform duration-300" />
        </div>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
