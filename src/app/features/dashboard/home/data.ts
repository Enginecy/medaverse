export type Sale = {
  agent: {
    name: string;
    imageUrl: string;
    title: string;
  };
  date: Date;
  product: string;
  price: number;
};

export const sales: Sale[] = [
  {
    agent: {
      name: "John Doe",
      imageUrl: "/profile.jpg",
      title: "Senior Associate",
    },
    date: new Date("2024-01-15"),
    product: "Premium Insurance Package",
    price: 2500,
  },
  {
    agent: {
      name: "Sarah Johnson",
      imageUrl: "/profile.jpg",

      title: "Sales Representative",
    },
    date: new Date("2024-01-14"),
    product: "Home Security System",
    price: 1800,
  },
  {
    agent: {
      name: "Michael Chen",
      imageUrl: "/profile.jpg",

      title: "Account Manager",
    },
    date: new Date("2024-01-13"),
    product: "Business Consulting Package",
    price: 3200,
  },
  {
    agent: {
      name: "Emily Rodriguez",
      imageUrl: "/profile.jpg",

      title: "Sales Associate",
    },
    date: new Date("2024-01-12"),
    product: "Software License",
    price: 950,
  },
  {
    agent: {
      name: "David Wilson",
      imageUrl: "/profile.jpg",

      title: "Senior Sales Manager",
    },
    date: new Date("2024-01-11"),
    product: "Marketing Automation Suite",
    price: 4500,
  },
  {
    agent: {
      name: "Lisa Thompson",
      imageUrl: "/profile.jpg",

      title: "Sales Representative",
    },
    date: new Date("2024-01-10"),
    product: "Cloud Storage Plan",
    price: 750,
  },
  {
    agent: {
      name: "Robert Martinez",
      imageUrl: "/profile.jpg",

      title: "Account Executive",
    },
    date: new Date("2024-01-09"),
    product: "Enterprise Solution",
    price: 5800,
  },
  {
    agent: {
      name: "Amanda Foster",
      imageUrl: "/profile.jpg",

      title: "Sales Associate",
    },
    date: new Date("2024-01-08"),
    product: "Training Program",
    price: 1200,
  },
];
