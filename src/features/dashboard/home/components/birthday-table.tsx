import type { Birthday } from "../data/home";
import { getUpComingBDs } from "@/features/dashboard/home/server/db/home";
import Image from "next/image";

export async function BirthdayTable() {
  const birthdays = await getUpComingBDs();

  const todaysBirthdays = birthdays?.filter((b) => b.isToday) ?? [];
  const upcomingBirthdays = birthdays?.filter((b) => !b.isToday) ?? [];

  const limitedUpComingBirthdays = [...upcomingBirthdays]
    ?.reverse()
    .slice(0, 5);

  // if (isPending) {
  //   return (
  //     <div className="space-y-6">
  //       <SkeletonSection title="Today" rows={2} />
  //       <div className="bg-muted h-px w-full" />
  //       <SkeletonSection title="Upcoming" rows={3} />
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <div className="text-destructive text-center text-sm">
  //       Failed to load birthdays. {error.message}
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {todaysBirthdays  && (
        <BirthdaySection title="Today" data={todaysBirthdays} />
      )}


      {upcomingBirthdays && (
        <BirthdaySection title="Upcoming" data={limitedUpComingBirthdays} />
      )}

      {todaysBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
        <div className="text-muted-foreground text-center">
          No upcoming birthdays.
        </div>
      )}
    </div>
  );
}

function BirthdaySection({ title, data }: { title: string; data: Birthday[] }) {
  if (data.length === 0) {
    return null;
  }
  return (
    <div>
      <h3 className="text-muted-foreground mb-3 text-sm font-medium">
        {title}
      </h3>
      <div className="space-y-2">
        {data.map((birthday, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Image
                src={birthday.agent.imageUrl}
                alt={birthday.agent.name}
                height={32}
                width={32}
                className="rounded-full object-cover"
              />
              <p className="text-sm font-medium">{birthday.agent.name}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm">
                {birthday.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {birthday.isToday && (
                <p className="text-primary text-xs">Today</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// function SkeletonSection({ title, rows }: { title: string; rows: number }) {
//   return (
//     <div>
//       <h3 className="text-muted-foreground mb-3 text-sm font-medium">
//         {title}
//       </h3>
//       <Table>
//         <TableBody>
//           {Array.from({ length: rows }).map((_, idx) => (
//             <TableRow key={idx} className="border-0">
//               <TableCell className="px-0 py-2" style={{ width: "70%" }}>
//                 <Skeleton className="h-4 w-3/4 rounded" />
//               </TableCell>
//               <TableCell
//                 className="px-0 py-2"
//                 style={{ width: "30%", textAlign: "right" }}
//               >
//                 <Skeleton className="h-4 w-1/2 rounded" />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
