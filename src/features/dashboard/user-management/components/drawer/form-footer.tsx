import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PulseMultiple } from "react-svg-spinners";

export function FormFooter({ isPending }: { isPending: boolean }) {
  return (
    <SheetFooter className="w-auto p-0">
      <Button
        variant={"default"}
        type="submit"
        disabled={isPending}
        className="bg-primary-600 w-full text-white"
      >
        {isPending ? <PulseMultiple color="white" /> : "Add Agent"}
      </Button>
    </SheetFooter>
  );
}
