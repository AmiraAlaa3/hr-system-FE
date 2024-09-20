
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageTitleComponent } from '../page-title/page-title.component';
import { HolidaysService } from '../../services/holidays.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offical-holiday-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageTitleComponent],
  templateUrl: './offical-holiday-form.component.html',
  styleUrls: ['./offical-holiday-form.component.css'] // Fix: Use 'styleUrls' with an array
})
export class OfficalHolidayFormComponent implements OnInit {

  holidayId: any;
  holiday: any;
  error : string = '';
  constructor(
    private holidayService: HolidaysService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (response) => {
        this.holidayId = response['id'];
      },
    });

    if (this.holidayId != 0) {
      this.holidayService.getHoliday(this.holidayId).subscribe({
        next: (response) => {
          this.holiday = response.data;

          // Set form values after fetching data
          this.getDate.setValue(this.holiday.date);
          this.getTitle.setValue(this.holiday.title);
          this.getDescription.setValue(this.holiday.description);
          this.getFromDate.setValue(this.holiday.from_date);
          this.getToDate.setValue(this.holiday.to_date);
          // this.getNumberOfDays.setValue(this.holiday.numberOfDays);
        },
      });
    }
  }

  // Form declaration
  holidayForm = new FormGroup({
    date: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]), // Fix: Correct form control name
    from_date: new FormControl('', [Validators.required]),
    to_date: new FormControl('', [Validators.required]),
    // numberOfDays: new FormControl('', [Validators.required]),
  });



  // Getters for form controls
  get getDate() {
    return this.holidayForm.controls['date'];
  }
  get getTitle() {
    return this.holidayForm.controls['title'];
  }
  get getDescription() {
    return this.holidayForm.controls['description']; // Fix: Correct the getter name to match the form control
  }
  get getFromDate() {
    return this.holidayForm.controls['from_date'];
  }
  get getToDate() {
    return this.holidayForm.controls['to_date'];
  }
  // get getNumberOfDays() {
  //   return this.holidayForm.controls['numberOfDays'];
  // }

  // Event handler for form submission
  HolidayHandler(e: any) {
    e.preventDefault();
    if (this.holidayForm.status === 'VALID') {
      if (this.holidayId == 0) {
        // Create a new holiday
        this.holidayService
          .createHoliday(this.holidayForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/officalHolidays'], {
                queryParams: { message: 'Holiday added successfully!' }
              });
            },
            error: (error) => {
              this.error = error.error.message;
            }
          });
      } else {
        // Update an existing holiday
        this.holidayService
          .updateHoliday(this.holidayId, this.holidayForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/officalHolidays'], {
                queryParams: { message: 'Holiday updated successfully!' }
              });
            },
            error: (error) => {
              this.error = error.error.message;
            }
          });
      }
    } else {
      this.holidayForm.markAllAsTouched(); // Mark all fields as touched if the form is invalid
    }
  }
}

