"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { USAMapComponent } from "@/components/usa-map";
import { states, type State } from "@/lib/data";

export function StatesCard() {
  const selectedStates: State[] = [...states];

  return (
    <Card className="w-2/3">
      <CardContent className="flex gap-4">
        <div className="flex w-1/3 flex-col gap-6">
          <CardTitle className="flex items-center justify-between gap-2">
            States
            {/* button */}
            <Button variant="outline" size="sm">
              <Edit />
              Edit
            </Button>
          </CardTitle>
          {/* chips for selected states */}
          <div className="flex max-h-[250px] flex-wrap gap-2 overflow-y-auto">
            {selectedStates
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((state) => (
                <div
                  key={state.code}
                  className="bg-background flex items-center gap-2 rounded-full
                    px-4 py-1"
                >
                  <div className="bg-accent h-2 w-2 rounded-full" />
                  <p>{state.name}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="grow rounded-2xl bg-[#084D851A]">
          <USAMapComponent selectedStates={selectedStates} />
        </div>
      </CardContent>
    </Card>
  );
}
