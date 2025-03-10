import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground pointer-coarse:active:bg-primary/90 pointer-fine:hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground pointer-coarse:active:bg-destructive/90 pointer-fine:hover:bg-destructive/90",
        outline:
          "border-[2px] border-input bg-background pointer-coarse:active:bg-accent pointer-coarse:active:text-accent-foreground pointer-fine:hover:bg-accent pointer-fine:hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground pointer-coarse:active:bg-secondary/80 pointer-fine:hover:bg-secondary/80",
        ghost: "[&_svg]:size-auto pointer-coarse:active:bg-accent pointer-coarse:active:text-accent-foreground pointer-fine:hover:bg-accent pointer-fine:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 pointer-coarse:active:underline pointer-fine:hover:underline",
        colorful: ""
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        chip: "rounded-2xl w-auto h-auto px-3 py-1"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, color, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), variant === "colorful" ? color : '')}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
