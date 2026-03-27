"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({ children, className = "", delay }: Props) {
  const ref = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
