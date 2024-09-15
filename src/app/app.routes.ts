import { Routes } from '@angular/router';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DepartmentComponent } from './pages/department/department.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { OfficalHolidaysComponent } from './pages/offical-holidays/offical-holidays.component';
import { SalaryComponent } from './pages/salary/salary.component';
import { UsersComponent } from './pages/users/users.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';
import { DepartmentDetailsComponent } from './components/department-details/department-details.component';
import { AttendanceFormComponent } from './components/attendance-form/attendance-form.component';
// import { AttendanceExcelComponent } from './components/attendance-excel/attendance-excel.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { authGuard } from './components/guard/auth.guard';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { HolidayFormComponent } from './components/holiday-form/holiday-form.component';
import { SettingsFormComponent } from './components/settings-form/settings-form.component';

export const routes: Routes = [
  { path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { path: 'login',
    component: LoginComponent, 
    title: 'Login' 
  },
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      { path: 'dashboard', 
        component: DashboardComponent, 
        title: 'Dashboard'
      },
      {
        path: 'attendance',
        component: AttendanceComponent,
        title: 'Attendance',
      },
      {
        path: 'attendance/:id/edit',
        component: AttendanceFormComponent,
        title: 'Edit Attendance',
      },
      { path: 'settings', 
        component: SettingsFormComponent, 
        title: 'settings' },
      {
        path: 'departments',
        component: DepartmentComponent,
        title: 'Departments',
      },
      {
        path: 'departments/:id/edit',
        component: DepartmentFormComponent,
        title: 'Edit Department',
      },
      {
        path: 'departments/:id',
        component: DepartmentDetailsComponent,
        title: 'Department Details',
      },
      {
        path: 'employees',
        component: EmployeesComponent,
        title: 'All Employees',
      },
      {
        path: 'employees/:id/edit',
        component: EmployeeFormComponent,
        title: 'Employee',
      },
      {
        path: 'employees/:id',
        component: EmployeeDetailsComponent,
        title: 'Employee',
      },
      { path: 'groups', 
        component: GroupsComponent, 
        title: 'Groups' },
      {
        path: 'officalHolidays',
        component: OfficalHolidaysComponent,
        title: 'Offical Holidays',
      },
      {
        path: 'officalHolidays/:id/edit',
        component: HolidayFormComponent,
        title: 'offical Holiday',
      },
      { path: 'salary',
        component: SalaryComponent, 
        title: 'Salary' },
      {
        path: 'salary/:id/edit',
        component: SalaryComponent,
        title: 'Edit Salary',
      },
      {
        path: 'users',
        component: UsersComponent,
        title: 'All Users',
        children: [
          { path: 'add', 
            component: UsersComponent, 
            title: 'Add new Admin' },
        ],
      },
    ],
  },

  { 
    path: '**', 
    component: NotfoundComponent, 
    title: 'not found' 
  },
];