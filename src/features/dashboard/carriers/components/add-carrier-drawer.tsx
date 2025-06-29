import { SheetContent, SheetTitle } from "@/components/ui/sheet";

export function AddCarrierDrawer({
  resolve,
}: {
  resolve: (_: unknown) => void;
}) {
  return (
    <SheetContent>
      <SheetTitle className="text-2xl font-semibold">Add Carrier</SheetTitle>
    </SheetContent>
  );
}
