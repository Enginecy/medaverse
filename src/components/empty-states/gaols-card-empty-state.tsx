import { AddGoalButton } from "@/features/dashboard/home/components/add-goal-button";

export function GoalsCardEmptyState() {
  return (
    <div
      className={`border-primary flex h-full w-full flex-col items-center
        justify-center rounded-3xl border-2 border-dashed bg-white/50 p-8
        text-center md:p-6`}
    >
      <h3 className="mt-2 text-base font-semibold">
        Add and customize your goal
      </h3>

      <AddGoalButton />
    </div>
  );
}
