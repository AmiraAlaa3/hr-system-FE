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
  ],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  attendances: any;
  message: string | null = null;
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

  showImportForm = false;
  selectedFile: File | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
        this.dataSource = new MatTableDataSource(response.data);
        console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.totalAttendances = response.data.length;
      },
      error: (error) => {
        console.log(error);
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
  // searchAttendances(): void {
  //   if (this.searchTerm.trim()) {
  //     this.attendanceService.searchAttendances(this.searchTerm).subscribe({
  //       next: (response) => {
  //         this.dataSource = new MatTableDataSource(response.data);
  //         this.dataSource.paginator = this.paginator;
  //         this.totalAttendances = response.data.length;
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
  //   } else {
  //     this.loadAttendances();
  //   }
  // }

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
            }, 3000);
            this.loadAttendances();
          },
          error: (error) => {
            console.error('Error deleting attendance', error);
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
      next: (response: any) => {
        this.importMessage = 'File imported successfully';
        this.loadAttendances();
        this.closeImportForm();
        setTimeout(() => {
          this.importMessage = null;
        }, 3000);
      },
      error: (error: any) => {
        this.importMessage = 'Error importing file';
        setTimeout(() => {
          this.importMessage = null;
        }, 3000);
      }
    });
  }
}

