import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Check, TriangleAlert } from "lucide-react";
const typeConfig = {
  error: {
    icon: <TriangleAlert className="h-5 w-5 text-red-500" />,
    color: "text-red-600",
    bg: "bg-red-200",
    bg2: "bg-red-100",
  },
  warning: {
    icon: <TriangleAlert className="h-5 w-5 text-yellow-300" />,
    color: "text-yellow-600",
    bg: "bg-yellow-200",
    bg2: "bg-yellow-100",
  },
  info: {
    icon: <TriangleAlert className="h-5 w-5 text-blue-700" />,
    color: "text-blue-600",
    bg: "bg-blue-200",
    bg2: "bg-blue-100",
  },
  success: {
    icon: <Check className="h-5 w-5 text-green-600" />,
    color: "text-green-600",
    bg: "bg-green-200",
    bg2: "bg-green-100",
  },
};

export function GeneralDialog({
  title,
  type,
  description,
  onClose,
}: {
  title: string;
  type: "error" | "warning" | "info" | "success";
  description: string;
  onClose?: () => void;
}) {
  const config = typeConfig[type];
  return (
    <DialogContent className="flex w-150 flex-col items-center justify-center">
      <div
        className={`flex h-15 w-15 items-center justify-center rounded-full
          ${config.bg2}`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full
            ${config.bg}`}
        >
          {config.icon}
        </div>
      </div>

      <DialogTitle className="text-center text-base font-semibold text-red-800">
        <span className="whitespace-pre-line">{title}</span>
      </DialogTitle>
      <DialogDescription className="text-l text-center font-bold text-red-500">
        {description}
      </DialogDescription>
      <p className="text-center text-sm font-light text-red-600"></p>
      <div className="flex w-full flex-row justify-end py-3">
        <Button
          className="w-30 border-2 border-red-200"
          variant="outline"
          onClick={onClose}
        >
          Okay
        </Button>
      </div>
    </DialogContent>
  );
}
