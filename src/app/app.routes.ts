import { Routes } from '@angular/router';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { BounsComponent } from './components/bouns/bouns.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepartmentComponent } from './components/department/department.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { GroupsComponent } from './components/groups/groups.component';
import { LeavesComponent } from './components/leaves/leaves.component';
import { OfficalHolidaysComponent } from './components/offical-holidays/offical-holidays.component';
import { SalaryComponent } from './components/salary/salary.component';
import { UsersComponent } from './components/users/users.component';
import { WeeklyHolidaysComponent } from './components/weekly-holidays/weekly-holidays.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent, title: 'Login' },
    { path: 'attendance', component: AttendanceComponent, title: 'Attendance' },
    { path: 'bouns', component: BounsComponent, title: 'Bouns' },
    { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
    { path: 'dapartments', component: DepartmentComponent, title: 'Departments' },
    { path: 'employees', component: EmployeesComponent, title: 'All Employees' },
    { path: 'groups', component: GroupsComponent, title: 'Groups' },
    { path: 'leaves', component: LeavesComponent, title: 'Leaves' },
    { path: 'officalHolidays', component: OfficalHolidaysComponent, title: 'Offical Holidays' },
    { path: 'salary', component: SalaryComponent, title: 'Salary' },
    { path: 'users', component: UsersComponent, title: 'All Users' },
    { path: 'weeklyHolidays', component: WeeklyHolidaysComponent, title: 'Weekly Holidays' },
    { path: '**', component: NotfoundComponent, title: 'not found' },
];