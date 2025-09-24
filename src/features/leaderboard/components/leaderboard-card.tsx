export function LeaderboardCard({
  user,
}: {
  user: {
    name: string;
    avatar: string;
    role: string;
    annualizedVolume: string;
    households: number;
  };
}) {
  return (
    <div
      className="relative flex w-full flex-col gap-4 overflow-hidden rounded-3xl
        bg-zinc-900 p-4 outline outline-zinc-800 md:gap-8 md:p-6 lg:p-10"
    >
      <div
        className="absolute top-16 left-16 h-40 w-full bg-gradient-to-br
          from-slate-700/40 via-blue-800/40 to-fuchsia-900/40 blur-2xl md:top-24
          md:left-24 md:h-60 lg:top-[120px] lg:left-[120px] lg:h-80"
      />

      <div
        className="flex w-full flex-col items-center justify-center gap-2
          md:gap-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="placeholder"
          className="h-20 w-20 rounded-2xl border md:h-28 md:w-28 md:rounded-3xl
            lg:h-36 lg:w-36 lg:rounded-4xl"
          src={user.avatar}
        />

        <div
          className="flex flex-col items-center justify-center gap-1 md:gap-1.5"
        >
          <div
            className="text-center text-lg font-semibold text-neutral-200
              md:text-2xl lg:text-3xl"
          >
            {user.name}
          </div>
          <div
            className="text-center text-sm font-semibold text-neutral-400
              md:text-lg lg:text-xl"
          >
            {user.role}
          </div>
        </div>
      </div>

      <div
        className="flex w-full flex-col items-center justify-between gap-4
          sm:flex-row sm:gap-0"
      >
        <div
          className="flex flex-col items-center justify-center gap-1 text-center
            text-sm font-medium text-neutral-400 sm:items-start sm:text-left
            md:gap-2 md:text-base"
        >
          Annualized Volume
          <span
            className="text-primary-300 text-2xl font-semibold md:text-3xl
              lg:text-4xl"
          >
            ${user.annualizedVolume == "" ? "0" : user.annualizedVolume}
          </span>
        </div>

        <div
          className="flex flex-col items-center justify-center gap-1 text-center
            text-sm font-medium text-neutral-400 sm:items-end sm:text-right
            md:gap-2 md:text-base"
        >
          Households
          <span
            className="text-primary-300 text-2xl font-semibold md:text-3xl
              lg:text-4xl"
          >
            {user.households}
          </span>
        </div>
      </div>
    </div>
  );
}
