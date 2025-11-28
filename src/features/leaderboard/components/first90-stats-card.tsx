export function First90StatsCard({
  title,
  value,
  color = "blue",
}: {
  title: string;
  value: string;
  color?: "blue" | "emerald" | "purple";
}) {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-cyan-600/30",
      text: "text-cyan-400",
      glow: "shadow-lg shadow-cyan-500/30",
      border: "border-cyan-500/30",
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-cyan-500/30",
      text: "text-emerald-400",
      glow: "shadow-lg shadow-emerald-500/30",
      border: "border-emerald-500/30",
    },
    purple: {
      bg: "bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-blue-600/30",
      text: "text-blue-400",
      glow: "shadow-lg shadow-blue-500/30",
      border: "border-blue-500/30",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`flex flex-col items-center justify-between gap-3.5 rounded-3xl
        bg-gradient-to-br from-slate-900/90 via-slate-800/50 to-slate-900/90 p-6
        outline outline-offset-[-1px] ${colors.border} backdrop-blur-sm
        transition-all hover:scale-[1.02] ${colors.glow}`}
    >
      <div
        className={`flex items-center justify-center gap-1.5 rounded-4xl px-4
          ${colors.bg} py-2 backdrop-blur-sm`}
      >
        <div className={`h-2.5 w-2.5 rounded-full ${colors.bg} animate-pulse`} />
        <div className={`justify-start text-base font-semibold ${colors.text}`}>
          {title}
        </div>
      </div>
      <div className={`text-center text-5xl font-bold ${colors.text} drop-shadow-lg`}>
        {value}
      </div>
    </div>
  );
}

