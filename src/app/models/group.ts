
import { Permission } from "./permission";
export interface Group {
    id: number;
    name: string;
    permissions: Permission[];
}
