import { Attendance } from './../../models/attendance';
// src/app/attendance-search/attendance-search.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance-search',
  templateUrl: './attendance-search.component.html',
  styleUrls: ['./attendance-search.component.css']
})
export class AttendanceSearchComponent {
  searchForm: FormGroup;
  attendances: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService
  ) {
    this.searchForm = this.fb.group({
      employeeName: [''],
      departmentName: ['']
    });
  }

  onSearch() {
    const { employeeName, departmentName } = this.searchForm.value;
    this.attendanceService.searchAttendances(employeeName, departmentName).subscribe({
      next: (data) => {
        this.attendances = data;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred';
        this.attendances = [];
      }
    });
  }
}
