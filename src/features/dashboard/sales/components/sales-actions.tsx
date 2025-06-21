import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export function SalesActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <Download />
        Download CSV
      </Button>
      <Button variant="default">
        <Plus />
        Add New
      </Button>
    </div>
  );
}
