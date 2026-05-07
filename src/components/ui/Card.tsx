import { cn } from "@/utils/cn";
import { HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-white rounded-xl border border-gray-200 shadow-sm", className)} {...props} />
  )
);
Card.displayName = "Card";

export default Card;
