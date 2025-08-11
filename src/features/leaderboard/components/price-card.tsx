export function TotalCard({ week, amount }: { week?: boolean, amount: string }) {
  const title = week ? "This Week" : "Today";
  const color = week ? "bg-sky-600/20" : "bg-emerald-500/20";
  const textColor = week ? "text-blue-500" : "text-emerald-500";
  const backgroundColor = week ? "bg-sky-600/20" : "bg-emerald-500/20";
  return (
    <div
      className="flex flex-col items-center justify-between gap-3.5 rounded-3xl
        bg-zinc-900 p-6 outline outline-offset-[-1px] outline-zinc-800"
    >
      <div
        className={`flex items-center justify-center gap-1.5 rounded-4xl px-4
          ${backgroundColor} py-2`}
      >
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <div className={`justify-start text-base font-semibold ${textColor}`}>
          {title}
        </div>
      </div>
      <div className={`text-center text-5xl font-bold ${textColor}`}>
        {amount}
      </div>
    </div>
  );
}
