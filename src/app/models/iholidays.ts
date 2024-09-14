import { Employee } from "./iemployee";

export interface Holidays {
  id?: number;
  title?: string;
  description?: string;
  from_date?: string;
  to_date?: string;
  numberOfDays?: number;
}
