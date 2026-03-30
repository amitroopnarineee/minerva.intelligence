"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

function CardDecorator() {
  return (
    <>
      <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2" />
      <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2" />
      <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2" />
      <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2" />
    </>
  );
}

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
  decorated?: boolean;
}

export function FeatureCard({ children, className, decorated = true }: FeatureCardProps) {
  return (
    <Card className={cn("mn-card group relative rounded-none shadow-zinc-950/5 bg-card/80 backdrop-blur-sm", className)}>
      {decorated && <CardDecorator />}
      {children}
    </Card>
  );
}

export { CardDecorator };
