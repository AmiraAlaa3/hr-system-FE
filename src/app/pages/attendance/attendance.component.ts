import { Attendance } from './../../models/attendance';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AttendanceService} from './../../services/attendance.service';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    AddButtonComponent,
    RouterLink,
    ConfirmModalComponent,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    MatSortModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  attendances: any;
  message: string | null = null;
  errors:string ='';
  showModal: boolean = false;
  attendanceIdToDelete: number | null = null;
  searchError : string = '';


  displayedColumns: string[] = ['id', 'DepartmentName','EmployeeName','checkIN','checkOUT','date', 'action'];
  dataSource!: MatTableDataSource<any>;
  totalAttendances: number = 0;
  searchTerm: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  importMessage: string | null = null;
  fatechError :string = '';
  showImportForm = false;
  selectedFile: File | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private attendanceService: AttendanceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.attendanceService.getAttendances().subscribe({

      next: (response) => {
          const sortedData = response.data.sort((a: any, b: any) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          this.dataSource = new MatTableDataSource(sortedData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.totalAttendances = sortedData.length;
      },
      error: (error) => {
        this.fatechError = error.error.message;
      },
    });
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    if(!filterValue) {
      this.searchError = 'Please enter a search term';
      setTimeout(() => {
        this.searchError = '';
      }, 3000);
      return;
    }

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const employeeName = data.employee_name ? data.employee_name.toLowerCase() : '';
      const departmentName = data.department_name ? data.department_name.toLowerCase() : '';

      return employeeName.includes(filter) || departmentName.includes(filter);
    };

    this.dataSource.filter = filterValue;
  }
  filterByDate(): void {
    const startDateValue = this.startDate ? new Date(this.startDate) : null;
    const endDateValue = this.endDate ? new Date(this.endDate) : null;
    if (!startDateValue &&!endDateValue) {
      this.searchError = 'Please Select Date';
      setTimeout(() => {
        this.searchError = '';
      }, 3000);
      return;
    }

    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const attendanceDate = data.date ? new Date(data.date) : null;

      const matchesDateRange =
        (!startDateValue || (attendanceDate && attendanceDate >= startDateValue)) &&
        (!endDateValue || (attendanceDate && attendanceDate <= endDateValue));

      return matchesDateRange || false;
    };

    this.dataSource.filter = 'filter'; // Just a dummy value to trigger the filter
  }


  closeMessage(): void {
    this.message = null;
    this.router.navigate([], { queryParams: { message: null } });
  }

  openDeleteModal(attendanceId: number): void {
    this.attendanceIdToDelete = attendanceId;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (this.attendanceIdToDelete !== null) {
      this.attendanceService
        .deleteAttendance(this.attendanceIdToDelete)
        .subscribe({
          next: () => {
            const filteredData = this.dataSource.data.filter(
              (attendance: any) => attendance.id !== this.attendanceIdToDelete
            );
            this.dataSource.data = filteredData;
            this.message = 'Attendance deleted successfully';
            setTimeout(() => {
              this.closeMessage();
            }, 5000);
            this.loadAttendances();
          },
          error: (error) => {
            this.errors =  error.error.message;
            setTimeout(() => {
              this.errors = '';
            }, 5000);
          },
        });
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.attendanceIdToDelete = null;
  }
  clearSearch() :void{
    this.searchTerm = '';
    this.dataSource.filter = '';
  }

  openImportForm(): void {
    this.showImportForm = true;
  }

  closeImportForm(): void {
    this.showImportForm = false;
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  importExcelFile(): void {
    if (!this.selectedFile) {
      this.importMessage = 'Please select a file to upload.';
      setTimeout(() => {
        this.importMessage = null;
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append('import_file', this.selectedFile);



    this.attendanceService.importExcelFile(formData).subscribe({
      next: (response) => {
        this.importMessage = 'File imported successfully';
        this.loadAttendances();
        this.closeImportForm();
        setTimeout(() => {
          this.importMessage = null;
        }, 5000);
      },
      error: (error) => {
      this.importMessage = 'File Importing Fail';
        setTimeout(() => {
          this.importMessage = null;
        }, 5000);
      }
    });
  }
}

