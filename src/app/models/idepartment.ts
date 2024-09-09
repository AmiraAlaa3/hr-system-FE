import { Employee } from "./iemployee";

export interface Department {
  id?: number;
  name?: string;
  employees_count?: number;
  employees?: Employee[];
}
