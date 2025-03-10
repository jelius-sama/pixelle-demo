"use client";

import { useThemeColor } from "@/hooks/useThemeColor";
import { HeartCrackIcon, HeartIcon, LucideProps } from "lucide-react";

interface IconProps extends Omit<LucideProps, "fill"> {}
export function HeartFilledIcon({ ...rest }: IconProps) {
  const foregroundColor = useThemeColor("foreground");

  return (
    <HeartIcon
      fill={foregroundColor}
      {...rest} // Spread the remaining props
    />
  );
}

export function HeartCrackFilledIcon({ ...rest }: IconProps) {
  const foregroundColor = useThemeColor("foreground");

  return (
    <HeartCrackIcon
      fill={foregroundColor}
      {...rest} // Spread the remaining props
    />
  );
}
