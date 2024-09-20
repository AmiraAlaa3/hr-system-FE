
import { Permission } from "./permission";
export interface Group {
    id: number;
    name: string;
    permissions: Permission[];
}


export interface Group2 {
    id?: number;
    name: string;
   permission_ids?: number[];
}
