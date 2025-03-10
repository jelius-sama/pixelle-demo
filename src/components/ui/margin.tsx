import { ReactNode } from "react";
import { cssVars } from "@/app.config";

interface MarginProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Margin({ children, style, ...rest }: MarginProps) {
  return (
    <div style={{ margin: `${cssVars.marginPx}px`, ...style }} {...rest}>
      {children}
    </div>
  );
}
