import { Component, OnInit } from '@angular/core';
import { Department } from '../../models/idepartment';
import { DepartmentService } from './../../services/department.service';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule,PageTitleComponent],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})




export class DepartmentComponent implements OnInit {
  departments: any;

  constructor(private departmentService: DepartmentService) { }
  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data;
        console.log(this.departments);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  searchDepartments(name: string): void {
    this.departmentService.searchDepartments(name).subscribe(
      data => {
        this.departments = data;
      },
      error => {
        console.error('Error searching departments', error);
      }
    );
  }
}
