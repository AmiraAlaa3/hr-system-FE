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
import { EmployeeService } from '../../services/employee.service'; // Import the employee service
import { PageTitleComponent } from '../page-title/page-title.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageTitleComponent],
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.css'] // Corrected styleUrls
})
export class AttendanceFormComponent implements OnInit {
  attendanceId: any;
  attendance: any;
  employees: any[] = []; // Array to hold employee data

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService, // Inject employee service
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Fetch the list of employees when the component initializes
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.employees = response.data; // Assuming response.data holds the list of employees
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
          checkIN: this.attendance.check_in,
          checkOUT: this.attendance.check_out,
          date: this.attendance.date,
        });
      },
    });
  }

  attendanceForm = new FormGroup({
    employee_id: new FormControl('', [Validators.required]), // Correctly named form control
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
  
}
