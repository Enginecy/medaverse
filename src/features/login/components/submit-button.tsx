import Button from "@mui/material/Button";
import type { UseFormReturn } from "react-hook-form";
import { PulseMultiple } from "react-svg-spinners";

export function SubmitButton({isLoading , step } :{


  isLoading: boolean;
  step: "email" | "pin"
}) {
    
    const label = step === "email" ? "Send OTP" : "Verify";
    return (
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#07406F]"
      >
        {isLoading ? <PulseMultiple color="white" /> : label}
      </Button>
    );
  }