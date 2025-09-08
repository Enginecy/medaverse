'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SegmentedButton } from "@/components/ui/segmented-button";

export function SalesCard() {
  const options = ["Week", "Month"];
  const [selected, setSelected] = useState<(typeof options)[number]>("Week");
  return (
    <Card className="flex h-50 w-full flex-col gap-0 rounded-3xl border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <SegmentedButton
            options={options.slice()}
            value={selected}
            onChange={(value) => {
              setSelected(value as (typeof options)[number]);
            }}
            className="md:text-xs text-black "
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
