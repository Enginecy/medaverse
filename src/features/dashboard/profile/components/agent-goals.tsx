import React from "react";
import { cn } from "@/lib/utils";
import { ChartRadialText } from "@/components/radial-chart";


export function AgentGoals(
  { size , color = "#1766A6" }: { size: number ; color: string } 
) {
  const goals = [
    { label: "Weekly Goal", currentValue: 11560, targetValue: 18000, trend: 7 },
    { label: "Monthly Goal", currentValue: 11560, targetValue: 20000, trend: 7 },
    { label: "Quarterly Goal", currentValue: 11560, targetValue: 15000, trend: -8 },
    { label: "Yearly Goal", currentValue: 11560, targetValue: 25000, trend: 7 },
  ];
  return (
    <div className="rounded-3xl border border-[#E5ECF6] bg-white p-6 w-2/3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Agent Goals</h2>
        <button className="flex items-center gap-2 rounded-lg border border-[#E5ECF6] px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {goals.map((goal) => (
          <GoalCard
            size={size}
            color={color}
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
function RadialProgress({
  percent,
  size,
  stroke,
  color,
  bg = "#E5ECF6",
} = {
  percent: 0,
  size: 72,
  stroke: 10,
  color: "#1766A6",
  bg: "#E5ECF6",
}) {

  return ( 
    <ChartRadialText title={'30%'} value={30} />
  )
}

function Trend({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs font-medium mt-2",
        isPositive ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50",
        "rounded-full px-2 py-0.5 w-fit"
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
  size,
  color,
}: {
  label: string;
  currentValue: number;
  targetValue: number;
  trend: number;
  size: number;
  color: string;
}) {
  const percent = Math.round((currentValue / targetValue) * 100);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between rounded-2xl border border-[#E5ECF6] bg-white p-6 min-w-[260px] min-h-[150px] shadow-sm w-full gap-4">
      <div className="flex flex-col items-start gap-1 flex-1"> {/* Adjusted gap */}
        <span className="text-md text-gray-500 font-medium">{label}</span>
        <span className="text-3xl font-bold text-gray-900">${currentValue.toLocaleString()}</span>
        <span className=" text-sm font-normal text-gray-700"> 
          {"of target $" + targetValue.toLocaleString()}
        </span>
        <Trend value={trend} />
      </div>
      <div className="flex items-center justify-center">
        <RadialProgress percent={percent} size={size} stroke={7} color={color} /> {/* Adjusted stroke to 7 */}
      </div>
    </div>
  );
}