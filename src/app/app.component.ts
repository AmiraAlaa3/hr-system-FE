import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DepartmentComponent } from "./components/department/department.component";
import { EmployeesComponent } from "./components/employees/employees.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DepartmentComponent, EmployeesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hr-system-FE';
}
