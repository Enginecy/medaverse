// import { ChartHalfRadialText } from "@/components/half-radial-chart";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// export function GoalCard({
//   title,
//   range,
// }: {
//   title: string;
//   range: {
//     min: number;
//     max: number;
//   };
// }) {
//   const value = Math.round((range.min / range.max) * 100);
// //   return(
// //     <GoalCardSkeleton/>
// //   ) 
//   return (
//     <Card className="flex min-h-0 w-full flex-col gap-0 overflow-hidden shadow-none border-0">
//       <CardHeader className="flex-shrink-0">
//         <CardTitle className="text-center text-lg font-semibold">
//           {title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="min-h-0 flex-1 py-6">
//         <ChartHalfRadialText title={`${value}%`} value={value} />
//       </CardContent>
//       <CardFooter className="flex-shrink-0">
//         <CardTitle className="mx-auto text-center">
//           <p className="text-md text-chart-3 font-semibold">
//             ${range.min}
//             <span className="text-muted-foreground text-sm font-normal">
//               {" out off $" + range.max}
//             </span>
//           </p>
//         </CardTitle>
//       </CardFooter>
//     </Card>
//   );
// }
// export function GoalCardSkeleton() {
//     return (
//         <Card className="flex min-h-0 w-full flex-col gap-0 overflow-hidden">
//             <CardHeader className="flex-shrink-0">
//                 <CardTitle className="mx-auto text-center text-lg font-semibold">
//                     <Skeleton className="h-6 w-32 mx-auto bg-gray-300" />
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="min-h-0 flex-1 py-6 flex items-center justify-center">
//                 <Skeleton className="h-24 w-24 rounded-full bg-gray-300" />
//             </CardContent>
//             <CardFooter className="flex-shrink-0">
//                 <CardTitle className="mx-auto text-center">
//                     <div className="flex flex-col items-center gap-1">

//                         <Skeleton className="h-4 w-40 bg-gray-300" />
//                     </div>
//                 </CardTitle>
//             </CardFooter>
//         </Card>
//     );
// }

