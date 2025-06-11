"use client";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useEffect, useRef, useState } from "react";

export function ChartHalfRadialText({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, []);

  return (
    <Gauge
      ref={ref}
      cornerRadius={6}
      value={value}
      startAngle={90}
      endAngle={-90}
      sx={() => ({
        [`& .${gaugeClasses.valueArc}`]: {
          fill: "var(--color-primary)",
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: "var(--color-primary-foreground)",
        },
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 24,
          transform: `translate(0px, -${height / 3.5}px)`,
        },
      })}
      text={title}
    />
  );
}
