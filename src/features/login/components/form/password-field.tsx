import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";

export function PasswordField({
    step,
    form,
}: {
    step: "email" | "pin";
    form: UseFormReturn<{ email: string; code?: string }>;
}) {
    return (
        <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel className="text-sm">Password</FormLabel>
                    <FormControl>
                        <Input
                            disabled={false}
                            placeholder="Enter your password"
                            {...field}
                            value={field.value || ""}
                            className={cn("w-full text-sm")}
                        />
                    </FormControl>
                    <FormMessage className="text-[0.625rem]" />
                </FormItem>
            )}
        />
    );
}
