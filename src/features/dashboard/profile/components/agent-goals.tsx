import React from "react";
import { cn } from "@/lib/utils";
import { ChartRadialText } from "@/components/radial-chart";

export function AgentGoals() {
  const goals = [
    { label: "Weekly Goal", currentValue: 11560, targetValue: 18000, trend: 7 },
    {
      label: "Monthly Goal",
      currentValue: 11560,
      targetValue: 20000,
      trend: 7,
    },
    {
      label: "Quarterly Goal",
      currentValue: 11560,
      targetValue: 15000,
      trend: -8,
    },
    { label: "Yearly Goal", currentValue: 11560, targetValue: 25000, trend: 7 },
  ];
  return (
    <div
      className="h-auto w-2/3 rounded-3xl border border-[#E5ECF6] bg-white p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Agent Goals</h2>
        <button
          className="flex items-center gap-2 rounded-lg border border-[#E5ECF6]
            px-4 py-2 text-sm font-medium text-gray-700 transition
            hover:bg-gray-50"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="#222"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 12h6M12 9v6" />
          </svg>
          Edit
        </button>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard
            key={goal.label}
            label={goal.label}
            currentValue={goal.currentValue}
            targetValue={goal.targetValue}
            trend={goal.trend}
          />
        ))}
      </div>
    </div>
  );
}

function Trend({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div
      className={cn(
        "mt-2 flex items-center gap-1 text-xs font-medium",
        isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500",
        "w-fit rounded-full px-2 py-0.5",
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d={isPositive ? "M2 8l4-4 4 4" : "M2 6l4 4 4-4"}
          stroke={isPositive ? "#22C55E" : "#EF4444"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {isPositive ? `+${value}%` : `${value}%`}
    </div>
  );
}

function GoalCard({
  label,
  currentValue,
  targetValue,
  trend,
}: {
  label: string;
  currentValue: number;
  targetValue: number;
  trend: number;
}) {
  const percent = Math.round((currentValue / targetValue) * 100);

  return (
    <div
      className="flex min-h-[150px] w-full min-w-[260px] flex-col items-center
        justify-between gap-4 rounded-2xl border border-[#E5ECF6] bg-white p-6
        shadow-sm md:flex-row"
    >
      <div className="flex flex-1 flex-col items-start gap-1">
        <span className="text-md font-medium text-gray-500">{label}</span>
        <span className="text-3xl font-bold text-gray-900">
          {currentValue.toLocaleString()}
        </span>
        <span className="text-sm font-normal text-gray-700">
          {"of target $" + targetValue.toLocaleString()}
        </span>
        <Trend value={trend} />
      </div>
      <div className="flex items-center justify-center">
        <ChartRadialText title={`${percent}%`} value={percent} />
      </div>
    </div>
  );
}
