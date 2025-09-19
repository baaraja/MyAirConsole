import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const liquidButtonVariants = cva(
  [
    // layout
    "relative inline-flex items-center justify-center select-none whitespace-nowrap align-middle",
    // shape + typography
    "rounded-lg font-sans font-medium antialiased",
    // transitions
    "transition-all duration-300",
    // pseudo layers for liquid-glass sheen
    "before:content-[''] before:absolute before:inset-0 before:rounded-lg before:pointer-events-none",
    "after:content-[''] after:absolute after:inset-0 after:rounded-lg after:pointer-events-none",
    // accessibility
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
    // disabled
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        glass: [
          "text-white",
          "bg-white/[0.025] border border-white/50 backdrop-blur-sm",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.75),_0_0_9px_rgba(0,0,0,0.2),_0_3px_8px_rgba(0,0,0,0.15)]",
          "hover:bg-white/30",
          "before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70",
          "after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50",
        ].join(" "),
        white: [
          "bg-white text-black border border-transparent",
          "hover:bg-gray-200",
          "before:bg-gradient-to-br before:from-white/80 before:via-transparent before:to-transparent before:opacity-70",
          "after:bg-gradient-to-tl after:from-white/50 after:via-transparent after:to-transparent after:opacity-50",
          "shadow-md hover:shadow-lg",
        ].join(" "),
        dark: [
          "bg-black/60 text-white border border-white/20 backdrop-blur-md",
          "hover:bg-black/80",
          "before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:opacity-40",
          "after:bg-gradient-to-tl after:from-white/5 after:via-transparent after:to-transparent after:opacity-30",
        ].join(" "),
        outline: [
          "bg-transparent text-white border border-white/50",
          "hover:bg-white/10",
          "before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-40",
          "after:bg-gradient-to-tl after:from-white/10 after:via-transparent after:to-transparent after:opacity-30",
        ].join(" "),
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "size-9 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "md",
      fullWidth: false,
    },
  }
);

export type LiquidButtonProps = (
  {
    href?: string;
    as?: "button" | "a";
    className?: string;
    children: React.ReactNode;
  } & VariantProps<typeof liquidButtonVariants>
) & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * LiquidButton – shadcn-style API
 * - variant: glass | white | dark | outline
 * - size: sm | md | lg | icon
 * - fullWidth: boolean
 * - href/as: render <a> when href is provided, else <button>
 */
export function LiquidButton({
  href,
  as,
  variant,
  size,
  fullWidth,
  className,
  children,
  ...props
}: LiquidButtonProps) {
  const Tag = (href || as === "a") ? ("a" as const) : ("button" as const);

  const classes = cn(
    liquidButtonVariants({ variant, size, fullWidth }),
    className
  );

  const commonProps: any = {
    className: classes,
    ...(href ? { href } : {}),
    ...props,
  };

  return React.createElement(Tag, commonProps, children);
}

export default LiquidButton;
