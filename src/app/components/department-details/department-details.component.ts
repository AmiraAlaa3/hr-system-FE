import { Component, OnInit, ViewChild } from '@angular/core';
import { PageTitleComponent } from '../page-title/page-title.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DepartmentService } from '../../services/department.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Employee } from '../../models/iemployee';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-department-details',
  standalone: true,
  imports: [
    RouterLink,
    PageTitleComponent,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css']
})
export class DepartmentDetailsComponent implements OnInit {
  departmentName: string ='';
  department: any;
  displayedColumns: string[] = ['id', 'name', 'email', 'position', 'salary' ,'action'];
  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>();
  departmentId: number = 0;
  totalEmployees: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private departmentService: DepartmentService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.departmentId = this.activatedRoute.snapshot.params['id'];
    this.loadDepartmentDetails();
  }

  loadDepartmentDetails(): void {
    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (response) => {
        // Extract employees array from the response
        this.department = response.data;
        this.departmentName = this.department.name;
        this.dataSource.data = this.department.employees;
        this.totalEmployees = this.department.employees_count;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error loading department details', error);
      }
    });
  }

  goBack(){
    this.router.navigate(['/departments']);
  }
}
