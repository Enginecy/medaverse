export type Birthday = {
  agent: {
    name: string;
    imageUrl: string;
    title: string;
    email: string | null; 
  };
  date: Date;
  isToday: boolean;
};
