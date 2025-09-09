import { Button } from "@/components/ui/button";
import { AllowPermissions } from "@/lib/supabase/roles-component";
import { Newspaper } from "lucide-react";
import Link from "next/link";

export function NewsListEmptyState() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center p-6
        text-center"
    >
      <div
        className="flex flex-col items-center gap-4 rounded-2xl  outline-2 outline-dashed outline-primary bg-gray-50 p-10 shadow-sm "
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full
            bg-blue-100"
        >
          <Newspaper className="h-8 w-8 text-blue-600" />
        </div>

        <h2 className="text-lg font-semibold md:text-xl">No News Yet</h2>
        <p className="max-w-sm text-sm text-gray-500">
          Stay tuned — announcements and updates will appear here once they’re
          published.
        </p>
          <Link href="/dashboard/create-news">
            <Button className="mt-4 rounded-xl px-6">
              Add Your News
            </Button>
          </Link>
        {/* <AllowPermissions permissions={["create:news"]}>
        </AllowPermissions> */}
      </div>
    </div>
  );
}
