import { Routes } from '@angular/router';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { BounsComponent } from './pages/bouns/bouns.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DepartmentComponent } from './pages/department/department.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { LeavesComponent } from './pages/leaves/leaves.component';
import { OfficalHolidaysComponent } from './pages/offical-holidays/offical-holidays.component';
import { SalaryComponent } from './pages/salary/salary.component';
import { UsersComponent } from './pages/users/users.component';
import { WeeklyHolidaysComponent } from './pages/weekly-holidays/weekly-holidays.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';
import { DepartmentDetailsComponent } from './components/department-details/department-details.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'Login' },
  { path: 'attendance', component: AttendanceComponent, title: 'Attendance' },
  { path: 'bouns', component: BounsComponent, title: 'Bouns' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'dapartments', component: DepartmentComponent, title: 'Departments' },
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
  { path: 'employees', component: EmployeesComponent, title: 'All Employees' },
  { path: 'employees/:id/edit', component: EmployeeFormComponent, title: 'Employees' },
  { path: 'groups', component: GroupsComponent, title: 'Groups' },
  { path: 'leaves', component: LeavesComponent, title: 'Leaves' },
  {
    path: 'officalHolidays',
    component: OfficalHolidaysComponent,
    title: 'Offical Holidays',
  },
  { path: 'salary', component: SalaryComponent, title: 'Salary' },
  { path: 'users', component: UsersComponent, title: 'All Users' },
  {
    path: 'weeklyHolidays',
    component: WeeklyHolidaysComponent,
    title: 'Weekly Holidays',
  },
  { path: '**', component: NotfoundComponent, title: 'not found' },
];
