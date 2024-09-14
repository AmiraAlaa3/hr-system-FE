// export interface Group {
//    id:number;
//     name: string;
//     permissions: string[];
//   }
  
//   export interface User {
//     id: number;
//     name: string;
//     email: string;
//     group_ids: number[]; // Optional: If `group_ids` are not provided in the response, this may need to be computed
//     groups: Group[];
//   }

export interface User {
  id: number;
  name: string;
  email: string;
  group: {
    id: number;
    name: string;
    permissions: string[];
  };
}