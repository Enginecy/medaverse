import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDrawer } from "@/hooks/modal";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

/**
 * Opens a drawer and returns a promise that resolves with a value when the drawer is closed.
 *
 * @example
 * const showDrawer = useShowDrawer();
 *
 * // Await a boolean result from the drawer
 * const result = await showDrawer((resolve) => (
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>Are you absolutely sure?</SheetTitle>
 *       <SheetDescription>
 *         This action cannot be undone. This will permanently delete your account and remove your data from our servers.
 *       </SheetDescription>
 *     </SheetHeader>
 *     <SheetFooter>
 *       <Button onClick={() => resolve(true)}>Confirm</Button>
 *       <Button onClick={() => resolve(false)}>Cancel</Button>
 *     </SheetFooter>
 *   </SheetContent>
 * ));
 *
 * if (result) {
 *   // User confirmed
 * } else {
 *   // User cancelled or closed the drawer
 * }
 */
export function useShowDrawer() {
  const { openDrawer, closeDrawer } = useDrawer();

  return <TResult,>(
    fn: (resolve: (value: TResult | undefined) => void) => React.ReactNode,
  ): Promise<TResult | undefined> => {
    return new Promise((resolve) => {
      const wrappedResolve = (value: TResult | undefined) => {
        resolve(value);
        closeDrawer();
      };
      openDrawer(fn(wrappedResolve), () => resolve(undefined));
    });
  };
}

type showSonnerToastProps = {
  message: string;
  description?: string;
  type: "success" | "error" | "warning" | "info";
};
export function showSonnerToast({
  message,
  description,
  type,
}: showSonnerToastProps): void {
  let messageComponent: React.ReactNode;
  let descriptionComponent: React.ReactNode;
  let iconComponent: React.ReactNode;

  switch (type) {
    case "success":
      messageComponent = <p className="text-foreground text-sm">{message}</p>;
      descriptionComponent = (
        <p className="text-accent-foreground text-xs">{description}</p>
      );
      iconComponent = <CheckCircle className="h-4 w-4 text-green-500" />;
      break;
    case "error":
      messageComponent = <p className="text-destructive text-sm">{message}</p>;
      descriptionComponent = (
        <p className="text-destructive text-xs">{description}</p>
      );
      iconComponent = <X className="text-destructive h-4 w-4" />;
      break;
    case "warning":
      messageComponent = <p className="text-foreground text-sm">{message}</p>;
      descriptionComponent = (
        <p className="text-accent-foreground text-xs">{description}</p>
      );
      iconComponent = <AlertCircle className="h-4 w-4 text-yellow-500" />;
      break;
    case "info":
      messageComponent = <p className="text-foreground text-sm">{message}</p>;
      descriptionComponent = (
        <p className="text-accent-foreground text-xs">{description}</p>
      );
      iconComponent = <Info className="h-4 w-4 text-blue-500" />;
      break;
    default:
      throw new Error(`Invalid toast type: ${type}`);
  }
  toast.custom(() => {
    return (
      <Alert>
        <AlertTitle>
          <div className="flex flex-row items-center gap-2">
            {iconComponent}
            {messageComponent}
          </div>
        </AlertTitle>
        <AlertDescription>{descriptionComponent}</AlertDescription>
      </Alert>
    );
  });
}
