import { Salary } from './../../models/salary';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { SalaryService} from './../../services/salary.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [PageTitleComponent,CommonModule, MatTableModule,FormsModule,RouterLink,MatPaginatorModule,SalaryComponent],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.css'
})

export class SalaryComponent implements OnInit {
  attendances: any;
  message: string | null = null;
  showModal: boolean = false;
  attendanceIdToDelete: number | null = null;

  displayedColumns: string[] = ['EmployeeName', 'DepartmentName', 'WorkDays', 'AbsenceDays', 'TotalBounsHours', 'TotalDeductionsHours', 'TotalBouns', 'TotalDeductions','totalsalary'];
  dataSource!: MatTableDataSource<any>;
  totalSalary: number = 0;
  searchTerm: string = '';
  month: number | null = null;
  year: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private SalaryService: SalaryService,
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
    this.loadSalary();
  }

  loadSalary(): void {
    this.SalaryService.getSalary().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.totalSalary = response.data.length;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const employeeName = data.name? data.name.toLowerCase() : '';
      return employeeName.includes(filter);
    };

    this.dataSource.filter = filterValue;
  }
  filterByDate(): void {
    if (this.month !== null && this.year !== null) {
      this.SalaryService.filterSalaryByDate(this.month, this.year).subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;
          this.totalSalary = response.data.length;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  
  searchSalary(): void {
    if (this.searchTerm.trim()) {
      this.SalaryService.searchSalary(this.searchTerm).subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;
          this.totalSalary = response.data.length;
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this.loadSalary();
    }
  }

  closeMessage(): void {
    this.message = null;
    this.router.navigate([], { queryParams: { message: null } });
  }

  openDeleteModal(attendanceId: number): void {
    this.attendanceIdToDelete = attendanceId;
    this.showModal = true;
  }

  // confirmDelete(): void {
  //   if (this.attendanceIdToDelete !== null) {
  //     this.attendanceService
  //       .deleteAttendance(this.attendanceIdToDelete)
  //       .subscribe({
  //         next: () => {
  //           const filteredData = this.dataSource.data.filter(
  //             (attendance: any) => attendance.id !== this.attendanceIdToDelete
  //           );
  //           this.dataSource.data = filteredData;
  //           this.message = 'Attendance deleted successfully';
  //           setTimeout(() => {
  //             this.closeMessage();
  //           }, 3000);
  //           this.loadAttendances();
  //         },
  //         error: (error) => {
  //           console.error('Error deleting attendance', error);
  //         },
  //       });
  //     this.closeModal();
  //   }
  // }

  closeModal(): void {
    this.showModal = false;
    this.attendanceIdToDelete = null;
  }
  clearSearch() :void{
    this.searchTerm = '';
    this.dataSource.filter = '';
  }
    months = [
      { name: 'January', value: 1 },
      { name: 'February', value: 2 },
      { name: 'March', value: 3 },
      { name: 'April', value: 4 },
      { name: 'May', value: 5 },
      { name: 'June', value: 6 },
      { name: 'July', value: 7 },
      { name: 'August', value: 8 },
      { name: 'September', value: 9 },
      { name: 'October', value: 10 },
      { name: 'November', value: 11 },
      { name: 'December', value: 12 }
    ];

  
  
}

