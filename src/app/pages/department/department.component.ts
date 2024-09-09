import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentService } from './../../services/department.service';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-department',
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
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  departments: any;
  message: string | null = null;
  showModal: boolean = false;
  departmentIdToDelete: number | null = null;

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource!: MatTableDataSource<any>;
  totalDepartments: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private departmentService: DepartmentService,
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
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.totalDepartments = response.data.length;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  closeMessage(): void {
    this.message = null;
    this.router.navigate([], { queryParams: { message: null } });
  }

  openDeleteModal(departmentId: number): void {
    this.departmentIdToDelete = departmentId;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (this.departmentIdToDelete !== null) {
      this.departmentService
        .deleteDepartment(this.departmentIdToDelete)
        .subscribe({
          next: () => {
            const filteredData = this.dataSource.data.filter(
              (department: any) => department.id !== this.departmentIdToDelete
            );
            this.dataSource.data = filteredData;
            this.message = 'Department deleted successfully';
            setTimeout(() => {
              this.closeMessage();
            }, 3000);
            this.loadDepartments();
          },
          error: (error) => {
            console.error('Error deleting department', error);
          },
        });
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.departmentIdToDelete = null;
  }
}
