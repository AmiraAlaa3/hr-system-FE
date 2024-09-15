import { Employee } from "./iemployee";

import { Department } from "./idepartment";


export interface Salary {

    id?: number;
    employee_name?: string;
    department_name?:string;
    checkIN?: string;
    checkOUT?: string;
    date?: string;
}
