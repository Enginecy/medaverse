import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { PulseMultiple } from "react-svg-spinners";

export function SubmitButton({
  isLoading,
  step,
}: {
  isLoading: boolean;
  step: "email" | "pin" | "password";
}) {
  const isDebug = env.NODE_ENV === "development";
  let label: string;
  if (isDebug) {
    label = "Login";
  } else {
    label = step === "email" ? "Send OTP" : step === "pin" ? "Verify" : "Login";
  }

  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn("bg-primary-600 w-full", isDebug && "bg-destructive")}
    >
      {isLoading ? <PulseMultiple color="white" /> : label}
    </Button>
  );
}
