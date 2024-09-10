import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageTitleComponent } from '../page-title/page-title.component';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service'; 

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageTitleComponent],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  employeeId: any;
  employee: any;
  departments: any[] = []; 
  errorMessages: any = {}; 
  genders :string []= ['male', 'female']; 
  Maritals :string [] = ['single','married','widowed'];
  
  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDepartments();

    this.activatedRoute.params.subscribe({
      next: (response) => {
        this.employeeId = response['id'];
        this.getName.setValue('');
      },
    });

    if (this.employeeId != 0) {
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (response) => {
          this.employee = response.data;
          this.employeeForm.patchValue(this.employee);
          console.log(this.employee)
          // this.getName.setValue(this.employee.name);
          // this.getAddress.setValue(this.employee.address);
          // this.getEmail.setValue(this.employee.email);
          // this.getPhone.setValue(this.employee.phone_number);
          // this.getGender.setValue(this.employee.gender);
          // this.getNationality.setValue(this.employee.nationality);
          // this.getMarital_status.setValue(this.employee.Marital_status);
          // this.getBirthdate.setValue(this.employee.birthdate);
          // this.getSsn.setValue(this.employee.ssn);
          // this.getHire_date.setValue(this.employee.hire_date);
          // this.getPosition.setValue(this.employee.position);
          // this.getSalary.setValue(this.employee.salary);
          // this.getCheck_in_time.setValue(this.employee.check_in_time);
          // this.getCheck_out_time.setValue(this.employee.check_out_time);
          this.getDepartment_id.setValue(this.employee.department.id);
        },
      });
    }
  }
  loadDepartments() {
    this.departmentService.getDepartments().subscribe((response) => {
      this.departments = response.data;
    });
  }

  employeeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,Validators.email]),
    address: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    Marital_status: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required]),
    ssn: new FormControl('', [Validators.required]),
    check_in_time: new FormControl('', [Validators.required]),
    check_out_time: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    department_id: new FormControl('', [Validators.required]),
    hire_date: new FormControl('', [Validators.required]),
    position: new FormControl('', [Validators.required]),
  });

  get getName() {
    return this.employeeForm.controls['name'];
  }

  get getAddress() {
    return this.employeeForm.controls['address'];
  }
  get getEmail() {
    return this.employeeForm.controls['email'];
  }
  get getPhone() {
    return this.employeeForm.controls['phone_number'];
  }
  get getGender() {
    return this.employeeForm.controls['gender'];
  }
  get getNationality() {
    return this.employeeForm.controls['nationality'];
  }

  get getMarital_status() {
    return this.employeeForm.controls['Marital_status'];
  }
  get getBirthdate() {
    return this.employeeForm.controls['birthdate'];
  }
  get getSsn() {
    return this.employeeForm.controls['ssn'];
  }
  get getCheck_in_time() {
    return this.employeeForm.controls['check_in_time'];
  }
  get getCheck_out_time() {
    return this.employeeForm.controls['check_out_time'];
  }
  get getSalary() {
    return this.employeeForm.controls['salary'];
  }
  get getDepartment_id() {
    return this.employeeForm.controls['department_id'];
  }
  get getHire_date() {
    return this.employeeForm.controls['hire_date'];
  }
  get getPosition() {
    return this.employeeForm.controls['position'];
  }

  EmployeeHandler(e: any) {
    e.preventDefault();
    if (this.employeeForm.status === 'VALID') {
      if (this.employeeId == 0) {
        this.employeeService.createEmployee(this.employeeForm.value).subscribe({
          next: () => {
            this.router.navigate(['/employees'], {
              queryParams: { message: 'Employee added successfully!' },
            });
          },
          error: (error) => {
            this.errorMessages = error.error.errors;
          }
        });
      } else {
        this.employeeService
          .updateEmployee(this.employeeId, this.employeeForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/employees'], {
                queryParams: { message: 'Department added successfully!' }
              });
            },
            error: (error) => {
              this.errorMessages = error.error.errors;
            }
          });
      }
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}
