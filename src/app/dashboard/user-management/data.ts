export type User = {
  id: number;
  name: string;
  imageUrl: string;
  username: string;
  email: string;
  status: "Active" | "Disabled";
  role: string; //TODO: add role enum
};

export const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    username: "johndoe",
    email: "john.doe@example.com",
    status: "Active",
    role: "Administrator",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    username: "sarahw",
    email: "sarah.wilson@example.com",
    status: "Active",
    role: "Editor",
  },
  {
    id: 3,
    name: "Michael Chen",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    username: "mchen",
    email: "michael.chen@example.com",
    status: "Disabled",
    role: "Viewer",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    username: "emilyr",
    email: "emily.rodriguez@example.com",
    status: "Active",
    role: "Editor",
  },
  {
    id: 5,
    name: "David Thompson",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    username: "dthompson",
    email: "david.thompson@example.com",
    status: "Active",
    role: "Viewer",
  },
  {
    id: 6,
    name: "Jessica Martinez",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    username: "jessicam",
    email: "jessica.martinez@example.com",
    status: "Active",
    role: "Administrator",
  },
  {
    id: 7,
    name: "Robert Johnson",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    username: "rjohnson",
    email: "robert.johnson@example.com",
    status: "Disabled",
    role: "Editor",
  },
  {
    id: 8,
    name: "Amanda Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    username: "afoster",
    email: "amanda.foster@example.com",
    status: "Active",
    role: "Viewer",
  },
  {
    id: 9,
    name: "Kevin Park",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    username: "kpark",
    email: "kevin.park@example.com",
    status: "Active",
    role: "Editor",
  },
  {
    id: 10,
    name: "Lisa Anderson",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    username: "landerson",
    email: "lisa.anderson@example.com",
    status: "Active",
    role: "Administrator",
  },
  {
    id: 11,
    name: "Daniel Kim",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    username: "dkim",
    email: "daniel.kim@example.com",
    status: "Disabled",
    role: "Viewer",
  },
  {
    id: 12,
    name: "Rachel Green",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    username: "rgreen",
    email: "rachel.green@example.com",
    status: "Active",
    role: "Editor",
  },
  {
    id: 13,
    name: "Mark Davis",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    username: "mdavis",
    email: "mark.davis@example.com",
    status: "Active",
    role: "Viewer",
  },
  {
    id: 14,
    name: "Nicole Turner",
    imageUrl:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150&h=150&fit=crop&crop=face",
    username: "nturner",
    email: "nicole.turner@example.com",
    status: "Active",
    role: "Administrator",
  },
  {
    id: 15,
    name: "Christopher Lee",
    imageUrl:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    username: "clee",
    email: "christopher.lee@example.com",
    status: "Disabled",
    role: "Editor",
  },
];
