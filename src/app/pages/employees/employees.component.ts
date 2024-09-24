import { Component, OnInit, ViewChild } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EmployeeService } from '../../services/employee.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
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
    ReactiveFormsModule
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  message: string | null = null;
  showModal: boolean = false;
  employeeIdToDelete: number | null = null;
  error: string = '';
  fatechError :string = '';
  noResultsMessage:string = '';

  searchControl = new FormControl('');

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
    // Listen for changes on the search input
    this.searchControl.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });
  }

  loadDepartments(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.totalEmployees = response.data.length;
      },
      error: (error) => {
          this.fatechError = error.error.message;
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
            this.error = error.error.message;
            setTimeout(() => {
              this.error = '';
            }, 5000);
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

  // Search by employee name
  applyFilter(value: any) {
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.filteredData.length === 0) {
      this.noResultsMessage = 'Enter the name of a valid employee';
    } else {
      this.noResultsMessage = ''; 
    }
  }

  clearSearch(){
    this.searchControl.setValue('');
    this.dataSource.filter = '';
  }
}
