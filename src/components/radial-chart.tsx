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

  return (
    <div className="h-30 w-auto">
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
        className="w-min"
      />
    </div>
  );
}
