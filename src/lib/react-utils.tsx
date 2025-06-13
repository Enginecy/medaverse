import { useDrawer } from "@/hooks/modal";

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
