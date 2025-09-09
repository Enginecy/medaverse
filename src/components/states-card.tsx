import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { USAMapComponent } from "@/components/usa-map";
import { type State } from "@/lib/data";

export function StatesCard({ states }: { states: State[] }) {
  if (states.length === 0) {
    return (
      <Card
        className="h-full  flex-1 items-center justify-center rounded-3xl
          border-0 shadow-none md:min-w-[630px]"
      >
        <CardContent className="flex h-full flex-col w-full gap-4">
            <CardTitle >
              States
            </CardTitle>

          <div className="rounded-2xl bg-[#084D851A] w-full max-h-90">
            <USAMapComponent selectedStates={states} />
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card
      className="h-full flex-1 items-center justify-center rounded-3xl border-0
        shadow-none md:min-w-[630px]"
    >
      <CardContent className="flex h-full w-full gap-4 justify-between xl:flex-col xl:h-120">
        <div className="flex w-full flex-col gap-3 max-h-28 ">
          <CardTitle className="flex items-center justify-between gap-2">
            States
            {/* button */}
            {/* <Button variant="outline" size="sm">
              <Edit />
              Edit
            </Button> */}
          </CardTitle>
          {/* chips for selected states */}
          <div className="flex max-h-[300px] flex-wrap gap-2 overflow-auto w-full">
            {states
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((state, idx) => (
                <div
                  key={idx}
                  className="bg-background flex items-center gap-2 rounded-full
                    px-4 py-1"
                >
                  <div className="bg-accent h-2 w-2 rounded-full" />
                  <p>{state.name}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="rounded-2xl bg-[#084D851A]">
          <USAMapComponent selectedStates={states} />
        </div>
      </CardContent>
    </Card>
  );
}
