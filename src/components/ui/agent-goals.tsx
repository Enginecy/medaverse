import React from "react";

function RadialProgress({ percent , size = 64, stroke = 8, color = "#1766A6", bg = "#E5ECF6" }: { 
    percent: number; size?: number; stroke?: number; color?: string; bg?: string;
}) {
  
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bg}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize={size * 0.22}
        fontWeight="bold"
        fill="#222"
      >
        {percent}%
      </text>
    </svg>
  );
}

function Trend({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>
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

function GoalCard({ label, value, percent, trend }: { label: string; value: string; percent: number; trend: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[#E5ECF6] bg-white p-6 min-w-[220px] min-h-[150px] shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <RadialProgress percent={percent} />
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
      <Trend value={trend} />
    </div>
  );
}

export function AgentGoals() {
  const goals = [
    { label: "Weekly Goal", value: "$11,560", percent: 62, trend: 7 },
    { label: "Monthly Goal", value: "$11,560", percent: 62, trend: 7 },
    { label: "Quarterly Goal", value: "$11,560", percent: 62, trend: -8 },
    { label: "Yearly Goal", value: "$11,560", percent: 62, trend: 7 },
  ];
  return (
    <div className="rounded-3xl border border-[#E5ECF6] bg-white p-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Agent Goals</h2>
        <button className="flex items-center gap-2 rounded-lg border border-[#E5ECF6] px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <svg width="18" height="18" fill="none" stroke="#222" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 12h6M12 9v6"/></svg>
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.label} {...goal} />
        ))}
      </div>
    </div>
  );
}
