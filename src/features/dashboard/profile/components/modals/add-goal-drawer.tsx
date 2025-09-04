"use client";

import { Button } from "@/components/ui/button";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useShowDrawer } from "@/lib/react-utils";
import { createGoalAction } from "../../server/actions/goals";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addGoalSchema, type AddGoalFormData } from "../../schemas/goal-schema";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddGoalSheetProps {
  resolve: (value: boolean) => void;
}

export function AddGoalDrawer({ resolve }: AddGoalSheetProps) {
  const router = useRouter();
  const form = useForm<AddGoalFormData>({
    resolver: zodResolver(addGoalSchema),
    defaultValues: {
      title: "",
      targetAmount: "",
      goalType: "sales",
    },
  });

  const onSubmit = async (data: AddGoalFormData) => {
    try {
      const target = parseFloat(data.targetAmount);

      const result = await createGoalAction({
        label: data.title,
        target,
        endDate: data.endDate,
        goalType: data.goalType,
        recurringDuration: data.recurringDuration,
      });

      if (result.success) {
        toast.success("Goal created successfully!");
        form.reset();
        resolve(true);
        // Refresh the page to update the goals list
        router.refresh();
      } else {
        toast.error( result.error.message );
        throw result.error ;
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Add New Goal</SheetTitle>
        <SheetDescription>
          Create a new goal to track your progress.
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Monthly Sales"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goalType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter target amount"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => {
              const recurringDuration = form.watch("recurringDuration");
              const isDisabled = !!recurringDuration;

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    End Date{" "}
                    {isDisabled ? "(Disabled - Recurring Goal)" : "(Optional)"}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            isDisabled && "cursor-not-allowed opacity-50",
                          )}
                          disabled={isSubmitting || isDisabled}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : isDisabled ? (
                            <span>Disabled for recurring goals</span>
                          ) : (
                            <span>Pick an end date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          // Clear recurring duration when end date is selected
                          if (date) {
                            form.setValue("recurringDuration", undefined);
                          }
                        }}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="recurringDuration"
            render={({ field }) => {
              const endDate = form.watch("endDate");
              const isRequired = !endDate;
              const isDisabled = !!endDate;

              return (
                <FormItem>
                  <FormLabel>
                    Recurring Duration{" "}
                    {isDisabled
                      ? "(Disabled - Has End Date)"
                      : isRequired
                        ? ""
                        : "(Optional)"}
                    {isRequired && !isDisabled && (
                      <span className="text-destructive"> *</span>
                    )}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Clear end date when recurring duration is selected
                      if (value) {
                        form.setValue("endDate", undefined);
                      }
                    }}
                    value={field.value}
                    disabled={isSubmitting || isDisabled}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          isDisabled && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <SelectValue
                          placeholder={
                            isDisabled
                              ? "Disabled for goals with end date"
                              : isRequired
                                ? "Select duration (required)"
                                : "Select duration"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>

      <SheetFooter>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Add Goal"}
        </Button>
        <SheetClose asChild>
          <Button variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

