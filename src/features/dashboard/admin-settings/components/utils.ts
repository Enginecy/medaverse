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
export const getLevelColor = (level: string) => {
  switch (level) {
    case "executive":
      return "bg-red-100 text-red-800";
    case "management":
      return "bg-orange-100 text-orange-800";
    case "staff":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
