export function OutlinedButton({
  children,
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={`border-0.5 flex h-12 items-center justify-center rounded-2xl border border-[#E5E6E6] px-6 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 `}
    >
      {children}
    </button>
  );
}
