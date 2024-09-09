import { Department } from "./idepartment";

export interface Employee {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  address: string;
  phone_number: string;
  hire_date: string;
  ssn: number;
  gender: string;
  nationality: string;
  position: string;
  Marital_status: string;
  salary: string;
  check_in_time: string;
  check_out_time: string;
  department: Department;
}
