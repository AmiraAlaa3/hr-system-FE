import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageTitleComponent],
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css',
})
export class DepartmentFormComponent implements OnInit {
  departmentId: any;
  department: any;
  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (response) => {
        this.departmentId = response['id'];
        this.getName.setValue('');
      },
    });

    if (this.departmentId != 0) {
      console.log(this.departmentId);
      this.departmentService.getDepartment(this.departmentId).subscribe({
        next: (response) => {
          this.department = response.data;
          this.getName.setValue(this.department.name);
        },
      });
    }
  }
  departmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  get getName() {
    return this.departmentForm.controls['name'];
  }
  DepartmentHandler(e: any) {
    e.preventDefault();
    if (this.departmentForm.status === 'VALID') {
      if (this.departmentId == 0) {
        this.departmentService
          .createDepartment(this.departmentForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/dapartments'], {
                queryParams: { message: 'Department added successfully!' }
              });
            },
          });
      } else {
        this.departmentService
          .updateDepartment(this.departmentId, this.departmentForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/dapartments'], {
                queryParams: { message: 'Department updated successfully!' }
              });
            },
          });
      }
    } else {
      this.departmentForm.markAllAsTouched();
    }
  }

}
