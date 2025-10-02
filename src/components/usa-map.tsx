"use client";
import React, { useMemo } from "react";
import {
  StateAbbreviations,
  USAMap,
  type USAStateAbbreviation,
} from "@mirawision/usa-map-react";
import { states, type State as USState } from "@/lib/data";

interface State {
  fill?: string;
  stroke?: string;
  onClick?: () => void;
}

type CustomStateSet = Partial<Record<USAStateAbbreviation, State>>;

type USAMapComponentProps = {
  selectedStates: USState[];
  onSelectState?: (state: USState) => void;
  onDeselectState?: (state: USState) => void;
};

// Geographic regions mapping
// const REGIONS = {
//   // Original regional divisions
//   NORTHEAST: ["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA"],
//   SOUTHEAST: [
//     "DE",
//     "MD",
//     "VA",
//     "WV",
//     "KY",
//     "TN",
//     "NC",
//     "SC",
//     "GA",
//     "FL",
//     "AL",
//     "MS",
//     "AR",
//     "LA",
//   ],
//   MIDWEST: [
//     "OH",
//     "MI",
//     "IN",
//     "IL",
//     "WI",
//     "MN",
//     "IA",
//     "MO",
//     "ND",
//     "SD",
//     "NE",
//     "KS",
//   ],
//   SOUTHWEST: ["TX", "OK", "NM", "AZ"],
//   WEST: ["MT", "WY", "CO", "UT", "ID", "WA", "OR", "NV", "CA"],
//   ALASKA_HAWAII: ["AK", "HI"],

//   // Simple directional regions
//   NORTH: [
//     "ME",
//     "NH",
//     "VT",
//     "NY",
//     "MI",
//     "WI",
//     "MN",
//     "ND",
//     "SD",
//     "MT",
//     "ID",
//     "WA",
//     "OR",
//     "AK",
//   ],
//   SOUTH: [
//     "FL",
//     "GA",
//     "SC",
//     "NC",
//     "TN",
//     "AL",
//     "MS",
//     "LA",
//     "AR",
//     "TX",
//     "OK",
//     "AZ",
//     "NM",
//     "NV",
//   ],
//   EAST: [
//     "ME",
//     "NH",
//     "VT",
//     "MA",
//     "RI",
//     "CT",
//     "NY",
//     "NJ",
//     "PA",
//     "DE",
//     "MD",
//     "VA",
//     "WV",
//     "NC",
//     "SC",
//     "GA",
//     "FL",
//   ],
//   CENTRAL: [
//     "OH",
//     "MI",
//     "IN",
//     "IL",
//     "WI",
//     "MN",
//     "IA",
//     "MO",
//     "ND",
//     "SD",
//     "NE",
//     "KS",
//     "KY",
//     "TN",
//     "AR",
//     "OK",
//   ],
// } as const;

// Transform classes for each region (scale + translate combinations)
const REGION_TRANSFORMS = {
  // Original regional divisions
  NORTHEAST: "scale-150 -translate-x-32 translate-y-16", // Pan left to show east coast
  SOUTHEAST: "scale-150 -translate-x-16 -translate-y-25", // Pan left to show southeast
  MIDWEST: "scale-125 translate-x-0 translate-y-8", // Keep centered
  SOUTHWEST: "scale-125 translate-x-8 -translate-y-16", // Pan right to show southwest
  WEST: "scale-125 translate-x-24 translate-y-4", // Pan right to show west coast
  ALASKA_HAWAII: "scale-150 translate-x-50 -translate-y-50",

  // Simple directional regions
  NORTH: "scale-110 translate-x-0 -translate-y-12", // Pan up to show northern states
  SOUTH: "scale-110 translate-x-0 -translate-y-20", // Pan down to show southern states
  EAST: "scale-120 -translate-x-20 translate-y-0", // Pan left to show eastern states
  CENTRAL: "scale-115 translate-x-0 translate-y-4", // Slight zoom on center

  DEFAULT: "scale-100 translate-x-0 translate-y-0",
} as const;

export function USAMapComponent({
  selectedStates,
  onSelectState,
  onDeselectState,
}: USAMapComponentProps) {
  const mapSettings = useMemo<CustomStateSet>(() => {
    const settings: CustomStateSet = {};

    StateAbbreviations.forEach((state) => {
      settings[state] = {
        fill: selectedStates.find((s) => s.code === state)
          ? "#084D85"
          : undefined,
        stroke: selectedStates.find((s) => s.code === state)
          ? "#B8D1FEB2"
          : undefined,
        onClick: () => {
          const clickedState = selectedStates.find((s) => s.code === state);
          const matchingState = states.find(
            (s) => s.code.toLowerCase() === state.toLowerCase(),
          );
          if (clickedState) {
            onDeselectState?.(clickedState);
          } else {
            onSelectState?.(matchingState!);
          }
        },
      };
    });

    return settings;
  }, [selectedStates, onSelectState, onDeselectState]);

  // Calculate the dominant region based on selected states
  const dominantRegion 
  = useMemo(() => {
    return "DEFAULT";
    // if (selectedStates.length === 0 || selectedStates.length === states.length)
    //   return "DEFAULT";

    // const regionCounts = Object.entries(REGIONS).reduce(
    //   (acc, [regionName, stateCodes]) => {
    //     const count = selectedStates.filter((state) =>
    //     state.code?
    //      (stateCodes as readonly string[]).includes(state.code.toUpperCase()): false
    //     ).length;
    //     acc[regionName] = count;
    //     return acc;
    //   },
    //   {} as Record<string, number>,
    // );

    // // Find the region with the most selected states
    // const maxCount = Math.max(...Object.values(regionCounts));

    // // If no clear majority (less than 30% of selections in one region), use default
    // if (maxCount === 0 || maxCount / selectedStates.length < 0.3) {
    //   return "DEFAULT";
    // }

    // // Get all regions with the maximum count
    // const topRegions = Object.entries(regionCounts)
    //   .filter(([_, count]) => count === maxCount)
    //   .map(([regionName, _]) => regionName);

    // // Priority order: more specific regions first, then directional
    // const regionPriority = [
    //   "NORTHEAST",
    //   "SOUTHEAST",
    //   "SOUTHWEST",
    //   "MIDWEST",
    //   "NORTH",
    //   "SOUTH",
    //   "EAST",
    //   "CENTRAL",
    //   "WEST",
    //   "ALASKA_HAWAII",
    // ];

    // // Return the highest priority region among those with max count
    // for (const region of regionPriority) {
    //   if (topRegions.includes(region)) {
    //     return region;
    //   }
    // }

    // return "DEFAULT";
  }, [
    // selectedStates
  ]);

  // Get the appropriate transform class
  const transformClass =
    REGION_TRANSFORMS[dominantRegion as keyof typeof REGION_TRANSFORMS] ||
    REGION_TRANSFORMS.DEFAULT;

  const isInteractive =
    onSelectState !== undefined || onDeselectState !== undefined;

  const isInteractiveStyle = (
    <style jsx global>
      {`
        .usa-state:hover {
          cursor: pointer;
          fill: #c6dbee;
          stroke-width: 3px;
        }
        .usa-state:active {
          cursor: pointer;
          fill: #6f8fa5;
          stroke-width: 3px;
        }
      `}
    </style>
  );

  const defaultStyle = (
    <style jsx global>
      {`
        .usa-state:hover {
          cursor: default;
        }
        .usa-state:active {
          cursor: default;
        }
      `}
    </style>
  );

  const style = isInteractive ? isInteractiveStyle : defaultStyle;

  return (
    <div className="relative h-full w-full overflow-hidden xl:h-90">
      <div
        className={`h-full w-full origin-center transition-transform
          duration-700 ease-in-out ${transformClass} `}
      >
        {style}
        <USAMap
          defaultState={{
            stroke: "#B8D1FEB2",
            fill: "#F4F7F9",
          }}
          customStates={mapSettings}
          mapSettings={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      {/* Optional: Region indicator */}
      {dominantRegion !== "DEFAULT" && (
        <div
          className="absolute top-4 right-4 rounded-full bg-blue-100 px-3 py-1
            text-sm font-medium text-blue-800"
        >
          Focused: {dominantRegion.replace("_", " & ")}
        </div>
      )}
    </div>
  );
}
