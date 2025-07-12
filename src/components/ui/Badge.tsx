import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/80",
        secondary: "bg-primary/10 text-primary",
        destructive: "bg-red-500 text-white hover:bg-red-500/80",
        outline: "text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
