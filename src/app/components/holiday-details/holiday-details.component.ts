import { Component } from '@angular/core';
import { Holidays } from '../../models/iholidays';
import { HolidaysService } from '../../services/holidays.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';


@Component({
  selector: 'app-holiday-details',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './holiday-details.component.html',
  styleUrl: './holiday-details.component.css'
})
export class HolidayDetailsComponent {

  
  holidayName: string = '';
  holiday: Holidays[] | any;
  holidayId: number = 0;
  constructor(
    private holidayService: HolidaysService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.holidayId = this.activatedRoute.snapshot.params['id'];
    this.loadHolidayDetails();
  }
  loadHolidayDetails() {
    this.holidayService.getHoliday(this.holidayId).subscribe({
      next: (response) => {
        this.holiday = response.data;
        console.log(this.holiday);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}


