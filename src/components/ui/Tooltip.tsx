import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = "top", align = "center", className }) => (
  <TooltipPrimitive.Provider delayDuration={200}>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        side={side}
        align={align}
        className={cn(
          "z-50 px-2 py-1 rounded-md text-xs bg-gray-900 text-gray-50 shadow-lg select-none",
          className
        )}
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-gray-900" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
); 