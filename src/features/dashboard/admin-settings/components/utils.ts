export const getActionColor = (action: string) => {
  switch (action) {
    case "read":
      return "bg-blue-100 text-blue-800";
    case "create":
      return "bg-green-100 text-green-800";
    case "update":
      return "bg-yellow-100 text-yellow-800";
    case "delete":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
export const getLevelColor = (level: number) => {
  if (level >= 5) return "bg-red-100 text-red-800";
  if (level >= 3 && level < 5) return "bg-orange-200 text-orange-900";
  if (level === 2) return "bg-orange-100 text-orange-800";
  if (level === 1) return "bg-yellow-100 text-yellow-800";
  if (level === 0) return "bg-blue-100 text-blue-800";
  if (level < 0) return "bg-gray-100 text-gray-800";
  return "bg-gray-100 text-gray-800";
};
