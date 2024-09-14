import { HolidaysService } from './../../services/holidays.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-offical-holidays',
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
  templateUrl: './offical-holidays.component.html',
  styleUrls: ['./offical-holidays.component.css'],
})
export class OfficalHolidaysComponent implements OnInit {
  holidays: any;
  message: string | null = null;
  showModal: boolean = false;
  holidayIdToDelete: number | null = null;

  displayedColumns: string[] = ['id', 'date', 'title', 'description', 'action'];
  dataSource!: MatTableDataSource<any>;
  totalHolidays: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
offical: any;
totaloffical: any;
holiday: any;

  constructor(
    private HolidaysService: HolidaysService,
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
    this.loadHolidays();
  }

  loadHolidays(): void {
    this.HolidaysService.getHolidays().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.totalHolidays = response.data.length;
        
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

  openDeleteModal(holidayId: number): void {
    this.holidayIdToDelete = holidayId;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (this.holidayIdToDelete !== null) {
      this.HolidaysService
        .deleteHoliday(this.holidayIdToDelete)
        .subscribe({
          next: () => {
            const filteredData = this.dataSource.data.filter(
              (holiday: any) => holiday.id !== this.holidayIdToDelete
            );
            this.dataSource.data = filteredData;
            this.message = 'holidays deleted successfully';
            setTimeout(() => {
              this.closeMessage();
            }, 3000);
            this.loadHolidays();
          },
          error: (error) => {
            console.error('Error deleting holiday', error);
          },
        });
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.holidayIdToDelete = null;
  }
}
