"use client";

import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

export const description = "A radial chart with text";

export function ChartRadialText({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  if (value < 0 || value > 100) {
    throw new Error("Value must be between 0 and 100");
  }

  return (
    <div className="h-full w-auto p-0">
      <Gauge
        cornerRadius={6}
        value={value}
        sx={() => ({
          [`& .${gaugeClasses.valueArc}`]: {
            fill: "var(--color-primary)",
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: "var(--color-primary-foreground)",
          },
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 24,
          },
        })}
        text={title}
        className="w-min text-sm"
      />
    </div>
  );
}
