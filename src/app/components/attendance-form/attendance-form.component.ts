import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { EmployeeService } from '../../services/employee.service';
import { PageTitleComponent } from '../page-title/page-title.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageTitleComponent],
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.css']
})
export class AttendanceFormComponent implements OnInit {
  attendanceId: any;
  attendance: any;
  employees: any[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Fetch the list of employees when the component initializes
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.employees = response.data;
      },
    });

    this.activatedRoute.params.subscribe({
      next: (response) => {
        this.attendanceId = response['id'];
        if (this.attendanceId != 0) {
          this.loadAttendanceData();
        }
      },
    });
  }

  // Load attendance data for editing
  loadAttendanceData() {
    this.attendanceService.getAttendance(this.attendanceId).subscribe({
      next: (response) => {
        this.attendance = response.data;
        this.attendanceForm.patchValue({
          employee_id: this.attendance.employee_id,
          checkIN: this.attendance.checkIN,
          checkOUT: this.attendance.checkOUT,
          date: this.attendance.date,
        });
      },
    });
  }

  attendanceForm = new FormGroup({
    employee_id: new FormControl('', [Validators.required]),
    checkIN: new FormControl('', [Validators.required]),
    checkOUT: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required])
  });

  get getEmployeeId() {
    return this.attendanceForm.controls['employee_id'];
  }
  get getCheckIn() {
    return this.attendanceForm.controls['checkIN'];
  }
  get getCheckOut() {
    return this.attendanceForm.controls['checkOUT'];
  }
  get getDate() {
    return this.attendanceForm.controls['date'];
  }

  attendanceHandler(e: any) {
    e.preventDefault();
    if (this.attendanceForm.status === 'VALID') {
      const formValue = this.attendanceForm.value;
      formValue.checkIN = this.convertToTimeWithSeconds(formValue.checkIN);
      formValue.checkOUT = this.convertToTimeWithSeconds(formValue.checkOUT);

      if (this.attendanceId == 0) {
        this.attendanceService
          .createAttendance(this.attendanceForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/attendance'], {
                queryParams: { message: 'Attendance added successfully!' },
              });
            },
            error: (error) => {
              console.log(this.attendanceForm.value)
              // Extract and set validation errors
              // this.setServerErrors(error);
            }
          });
      } else {
        this.attendanceService
          .updateAttendance(this.attendanceId, this.attendanceForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/attendance'], {
                queryParams: { message: 'Attendance updated successfully!' },
              });
            },
          });
      }
    } else {
      this.attendanceForm.markAllAsTouched();
    }
  }

 convertToTimeWithSeconds(time: any): string {
    if (time.length === 8) {
      return time;
    }
    return time + ':00';
  }
}
