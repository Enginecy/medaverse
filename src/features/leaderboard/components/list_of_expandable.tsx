import { ExpandableTile } from "@/features/leaderboard/components/expandable_tile";

export function ListOfExpandable({
  data,
}: {
  data: unknown[]; ////!!!!!!
}) {
  return (
    <div>
      {data.map((item, index) => (
        <ExpandableTile key={index} id={""} roleName={""} /> //!!!!
      ))}
    </div>
  );
}
