import { Salary } from './../../models/salary';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { SalaryService} from './../../services/salary.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import printJS from 'print-js'
@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [PageTitleComponent,CommonModule, MatTableModule,FormsModule,RouterLink,MatPaginatorModule,SalaryComponent],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.css'
})

export class SalaryComponent implements OnInit {
  message: string | null = null;
  showModal: boolean = false;
  noResultsMessage :string = '';
  displayedColumns: string[] = ['EmployeeName', 'DepartmentName','salary', 'WorkDays', 'AbsenceDays', 'TotalBounsHours',
    'TotalDeductionsHours', 'TotalBouns', 'TotalDeductions','totalsalary','action'];
  dataSource!: MatTableDataSource<any>;
  totalSalary: number = 0;
  searchTerm: string = '';
  month: number | null = null;
  year: number | null = null;
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
  fatechError: string = '';
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
        this.fatechError = error.error.message;
      },
    });
  }
  // applyFilter(): void {
  //   const filterValue = this.searchTerm.trim().toLowerCase();
  //   this.dataSource.filterPredicate = (data: any, filter: string) => {
  //     const employeeName = data.name? data.name.toLowerCase() : '';
  //     return employeeName.includes(filter);
  //   };
  //   if (this.dataSource.filteredData.length === 0) {
  //     this.noResultsMessage = 'Enter the name of a valid employee';
  //   } else {
  //     this.noResultsMessage = '';
  //   }

  //   this.dataSource.filter = filterValue;
  // }
  // filterByDate(): void {
  //   if (this.month !== null && this.year !== null) {
  //     this.SalaryService.filterSalaryByDate(this.month, this.year).subscribe({
  //       next: (response) => {
  //         this.dataSource = new MatTableDataSource(response.data);
  //         this.dataSource.paginator = this.paginator;
  //         this.totalSalary = response.data.length;
  //         if (this.dataSource.filteredData.length === 0) {
  //           this.noResultsMessage = 'Enter valid date';
  //         } else {
  //           this.noResultsMessage = '';
  //         }
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
  //   }
  //   else{
  //     this.noResultsMessage = 'Please select a month and year';
  //     setTimeout(() => {
  //         this.noResultsMessage = '';
  //       }, 5000);
  //   }
  // }

  // searchSalary(): void {
  //   const employeeName = this.searchTerm.trim() || undefined;
  //   const selectedMonth = this.month || undefined;
  //   const selectedYear = this.year || undefined;

  //   this.SalaryService.searchSalary(employeeName, selectedMonth, selectedYear).subscribe({
  //     next: (response) => {
  //       this.dataSource = new MatTableDataSource(response.data);
  //       this.dataSource.paginator = this.paginator;
  //       this.totalSalary = response.data.length;
  //       console.log(this.dataSource);


  //       if (this.dataSource.filteredData.length === 0) {
  //         this.noResultsMessage = 'No results found for the given criteria';
  //       } else {
  //         this.noResultsMessage = '';
  //       }
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }
  searchSalary(): void {
    const name = this.searchTerm.trim() || undefined;
    const filterValue = this.searchTerm.trim().toLowerCase();

    if (name && this.month && this.year) {
      // Search by both name and date
      this.SalaryService.searchSalary(name, this.month, this.year).subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;

          // Handle no results for combined search
          this.noResultsMessage = this.dataSource.data.length === 0 ? 'No results found for the given criteria.' : '';
        },
        error: (error) => {
          console.log(error);
        },
      });
    }  else if (name) {
      // Search by name only
      this.dataSource.filterPredicate = (data: any) => {
        const employeeName = data.name ? data.name.toLowerCase() : '';
        return employeeName.includes(filterValue);
      };
      this.dataSource.filter = filterValue;
      this.noResultsMessage = this.dataSource.filteredData.length === 0 ? 'Enter the name of a valid employee' : '';
    } else if (this.month && this.year) {
      // Search by date only
      this.SalaryService.filterSalaryByDate(this.month, this.year).subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;
          this.noResultsMessage = this.dataSource.data.length === 0 ? 'No results found for the given date.' : '';
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      // No valid input
      this.noResultsMessage = 'Please enter a name or select a month and year';
      setTimeout(() => {
        this.noResultsMessage = '';
      }, 5000);
    }
  }


  closeMessage(): void {
    this.message = null;
    this.router.navigate([], { queryParams: { message: null } });
  }

  clearSearch() :void{
    this.searchTerm = '';
    this.dataSource.filter = '';
  }

  printSalary(salary: any): void {
      const printContent = `
        <div>
          <h1>Salary Details</h1>
          <hr>
          <div class='content'>
           <p><strong>Name:</strong> ${salary.name}</p>
          <p><strong>Department:</strong> ${salary.department.name}</p>
          <p><strong>Work Days:</strong> ${salary.work_days}</p>
          <p><strong>Absence Days:</strong> ${salary.absence_days}</p>
          <p><strong>Total Bonus Hours:</strong> ${salary.total_bonus_hours}</p>
          <p><strong>Total Deduction Hours:</strong> ${salary.total_deduction_hours}</p>
          <p><strong>Bonus Amount:</strong> ${salary.bonus_amount.toFixed(2)}</p>
          <p><strong>Deductions Amount:</strong> ${salary.deductions_amount.toFixed(2)}</p>
          </div>
          <hr>
          <p id="sub-title"><strong>Total Salary:</strong> ${salary.total_salary.toFixed(2)}</p>
        </div>
      `;
      printJS({
        printable: printContent,
        type: 'raw-html',
        style: `
          h1 { text-align: center; }
          div { font-family: Arial, sans-serif;}
          #sub-title{font-size:18px ; color:#e94d65;text-align:end}
        `,
        scanStyles: false
      });
    }

}

