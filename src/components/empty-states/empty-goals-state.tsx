import { AddGoalButton } from "@/features/dashboard/home/components/add-goal-button";
import { Calendar, DollarSign, Target, TrendingUp } from "lucide-react";

export function EmptyGoalsState() {
  return (
    <div className="flex flex-col items-center justify-center px-8">
      <div className="relative mb-6">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center
            rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
        >
          <Target className="h-8 w-8 text-white" />
        </div>
        <div
          className="absolute -top-1 -right-1 flex h-6 w-6 items-center
            justify-center rounded-full bg-green-500"
        >
          <TrendingUp className="h-3 w-3 text-white" />
        </div>
      </div>

      <h3 className="text-foreground mb-2 text-xl font-semibold">
        Start Your Success Journey
      </h3>

      <p
        className="text-muted-foreground mb-6 max-w-md text-center
          leading-relaxed"
      >
        Set your first goal and watch your progress soar! Whether it&apos;s
        sales targets or revenue milestones, tracking goals helps you achieve 3x
        better results.
      </p>

      <div
        className="text-muted-foreground mb-8 flex items-center gap-6 text-sm"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span>Track Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span>Set Deadlines</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-purple-500" />
          <span>Monitor Progress</span>
        </div>
      </div>

      <AddGoalButton />
    </div>
  );
}
