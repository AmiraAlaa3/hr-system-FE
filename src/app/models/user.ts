export interface User {
  id: number;
  Full_name:string;
  name: string;
  email: string;
  group: {
    id: number;
    name: string;
    permissions: string[];
  };
}
