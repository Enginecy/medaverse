import { AddGoalButton } from "@/features/dashboard/home/components/add-goal-button";
import { Plus } from "lucide-react";

export function GaolsCardEmptyState() {
  return (
    <div
      className={`border-primary flex h-auto w-full flex-col items-center
        justify-center rounded-3xl border-2 border-dashed bg-white/50 p-8
        text-center md:h-[180px] md:p-6`}
    >
      <h3 className="mt-2 text-base font-semibold">
        Add and customize your gaol
      </h3>

      <AddGoalButton />
    </div>
  );
}
