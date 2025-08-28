export type Birthday = {
  agent: {
    name: string;
    imageUrl: string;
    // title: string; //TODO: Add user role when available
    email: string | null; 
  };
  date: Date;
  isToday: boolean;
};
