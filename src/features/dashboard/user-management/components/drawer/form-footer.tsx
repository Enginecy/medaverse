import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PulseMultiple } from "react-svg-spinners";

export function FormFooter(
    props: {
        isPending: boolean;
    }
){

    return ( 
        <SheetFooter className="w-auto p-0">
            <Button
              variant={"default"}
              type="submit"
              disabled= {props.isPending}
              className="bg-primary-600 w-full text-white"
            >
              {props.isPending ? <PulseMultiple color="white" /> : "Add Agent"}
            </Button>
          </SheetFooter>
    )
}