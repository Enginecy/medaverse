
export function DataTile({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="flex flex-row justify-between text-black">
      <p className="text-gray-500"> {title}</p>
      <p >{content}</p>
    </div>
  );
}
