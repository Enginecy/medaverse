import Button from "@mui/material/Button";
import type { UseFormReturn } from "react-hook-form";
import { PulseMultiple } from "react-svg-spinners";

export function SubmitButton({isSendingOtp , isVerifyingOtp , step } :{


  isSendingOtp: boolean,
  isVerifyingOtp : boolean , 
  step: "email" | "pin"
}) {
    const isLoading = isSendingOtp || isVerifyingOtp;
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