import { ChartRadialText } from "@/components/radial-chart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CommissionCard({
  title,
  range,
}: {
  title: string;
  range: {
    min: number;
    max: number;
  };
}) {
  const value = Math.round((range.min / range.max) * 100);
  return (
    <Card className="flex h-50 w-full flex-col gap-0 rounded-3xl border-0 shadow-none">
      <CardHeader>
        <CardTitle >
          <p className="text-xs font-semibold">
            ${range.min}
            <span className="text-muted-foreground text-xs ">
              {" of target $" + range.max}
            </span>
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-30 text-sm" >
        <ChartRadialText  title={`${value}%`} value={value} />
      </CardContent>
      <CardFooter>
        <CardTitle className="text-secondary-foreground">{title}</CardTitle>
      </CardFooter>
    </Card>
  );
}
