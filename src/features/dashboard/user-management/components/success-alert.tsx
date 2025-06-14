import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SuccessAlert({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode | string;
}) {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert >
        <CheckCircle2Icon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{content}</AlertDescription>
      </Alert>
    </div>
  );
}
