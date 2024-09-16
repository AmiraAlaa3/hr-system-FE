import { Employee } from "./iemployee";

export interface General {
    weekend1?: string;         // Optional property
    weekend2?: string;         // Optional property
    bonusHours?: number;       // Optional property
    deductionsHours?: number;  // Optional property
    employees?: Employee[];    // Reference to another model (Employee)
  }
  