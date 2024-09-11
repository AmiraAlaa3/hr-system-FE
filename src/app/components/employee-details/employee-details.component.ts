import { EmployeeService } from './../../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Employee } from '../../models/iemployee';
import { CommonModule, Location } from '@angular/common';
@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css',
})
export class EmployeeDetailsComponent implements OnInit {
  employeeName: string = 'Amera';
  employee: Employee[] | any;
  employeeId: number = 0;
  constructor(
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.employeeId = this.activatedRoute.snapshot.params['id'];
    this.loadEmployeeDetails();
  }
  loadEmployeeDetails() {
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (response) => {
        this.employee = response.data;
        console.log(this.employee);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
