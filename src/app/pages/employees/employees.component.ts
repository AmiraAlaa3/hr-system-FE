import { Component, OnInit, ViewChild } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    AddButtonComponent,
    RouterLink,
    ConfirmModalComponent,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  message: string | null = null;
  showModal: boolean = false;
  employeeIdToDelete: number | null = null;

  displayedColumns: string[] =  ['id', 'name', 'email', 'position', 'department','action'];
  dataSource!: MatTableDataSource<any>;
  totalEmployees: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
 ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.message = params['message'] || null;
      if (this.message) {
        setTimeout(() => {
          this.closeMessage();
        }, 6000);
      }
    });
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.totalEmployees = response.data.length;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openDeleteModal(employeeId: number): void {
    this.employeeIdToDelete = employeeId;
    this.showModal = true;
  }
  confirmDelete(): void {
    if (this.employeeIdToDelete !== null) {
      this.employeeService
        .deleteEmployee(this.employeeIdToDelete)
        .subscribe({
          next: () => {
            const filteredData = this.dataSource.data.filter(
              (department: any) => department.id !== this.employeeIdToDelete
            );
            this.dataSource.data = filteredData;
            this.message = 'Employee deleted successfully';
            setTimeout(() => {
              this.closeMessage();
            }, 3000);
            this.loadDepartments();
          },
          error: (error) => {
            console.error('Error deleting Employee', error);
          },
        });
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.employeeIdToDelete = null;
  }

  closeMessage() {
    this.message = null;
  }
}
