export type Birthday = {
  agent: {
    name: string;
    imageUrl: string;
    title: string;
  };
  date: Date;
  isToday: boolean;
};

export const birthdays: Birthday[] = [
  {
    agent: {
      name: "Austin Woodruff",
      imageUrl: "/profile.jpg",
      title: "Senior Associate",
    },
    date: new Date(),
    isToday: true,
  },
  {
    agent: {
      name: "Ryan Hoffman",
      imageUrl: "/profile.jpg",
      title: "Associate Director",
    },
    date: new Date(),
    isToday: true,
  },
  {
    agent: {
      name: "Austin Woodruff",
      imageUrl: "/profile.jpg",
      title: "Senior Associate",
    },
    date: new Date("2024-08-22"),
    isToday: false,
  },
  {
    agent: {
      name: "Austin Woodruff",
      imageUrl: "/profile.jpg",
      title: "Senior Associate",
    },
    date: new Date("2024-08-22"),
    isToday: false,
  },
  {
    agent: {
      name: "Austin Woodruff",
      imageUrl: "/profile.jpg",
      title: "Senior Associate",
    },
    date: new Date("2024-08-22"),
    isToday: false,
  },
];
