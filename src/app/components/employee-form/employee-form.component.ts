import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
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
  errorMessages: { [key: string]: string[] } = {};
  error:string = '';
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
    phone_number: new FormControl('', [Validators.required,Validators.minLength(11),this.numberValidator]),
    gender: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    Marital_status: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required,this.ageValidator(20)]),
    ssn: new FormControl('', [Validators.required, Validators.minLength(14),Validators.maxLength(14),this.numberValidator]),
    check_in_time: new FormControl('', [Validators.required]),
    check_out_time: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required,this.numberValidator]),
    department_id: new FormControl('', [Validators.required]),
    hire_date: new FormControl('', [Validators.required]),
    position: new FormControl('', [Validators.required]),
  });

  ageValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= minAge ? null : { 'ageInvalid': { value: control.value } };
    };
  }

  numberValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const validNumberPattern = /^[0-9]*$/;
    if (control.value && !validNumberPattern.test(control.value)) {
      return { 'invalidNumber': true };
    }
    return null;
  }

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
            if (error.status === 400) {
              this.errorMessages = error.error.error;
            } else if (error.status === 403) {
              this.error = error.error.message;
            } else {
              console.error('Error creating user:', error);
            }
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
              if (error.status === 400) {
                this.errorMessages = error.error.error;
              } else if (error.status === 403) {
                this.error = error.error.message;
              } else {
                console.error('Error creating user:', error);
              }
            }
          });
      }
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  // Method to get the keys of errorMessages
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Method to check if there are any errors
  hasErrors(): boolean {
    return Object.keys(this.errorMessages).length > 0;
  }

}
