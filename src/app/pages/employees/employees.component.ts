import { Component } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [PageTitleComponent,AddButtonComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {}
