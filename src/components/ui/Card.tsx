import { cn } from "@/utils/cn";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        variant === "glass"
          ? "glass-card"
          : "bg-white rounded-xl border border-[var(--lp-border-subtle)] shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export default Card;
