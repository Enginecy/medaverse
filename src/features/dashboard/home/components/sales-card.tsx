"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SegmentedButton } from "@/components/ui/segmented-button";
import { cn } from "@/lib/utils";

export function SalesCard({
  className,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
  const options = ["Week", "Month"] as const;
  const [selected, setSelected] = useState<(typeof options)[number]>("Week");
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          <SegmentedButton
            options={options.slice()}
            value={selected}
            onChange={(value) => {
              setSelected(value as (typeof options)[number]);
            }}
            className="md:text-xs"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex grow flex-col items-center justify-center">
        <p className="text-5xl font-bold">
          24
          <span className="text-muted-foreground text-2xl">/122</span>
        </p>
      </CardContent>
      <CardFooter>
        <CardTitle className="text-secondary-foreground">Total Sales</CardTitle>
      </CardFooter>
    </Card>
  );
}
