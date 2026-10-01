

import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { EmployeeList } from './employees/employee-list/employee-list';
import { EmployeeForm } from './employees/employee-form/employee-form';
import { LeaveList } from './leaves/leave-list/leave-list';
import { LeaveForm } from './leaves/leave-form/leave-form';
import { PayrollList } from './payroll/payroll-list/payroll-list';
import { ReportSummary } from './reports/report-summary/report-summary';
import { AttendanceList } from './attendance/attendance-list/attendance-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard },
  { path: 'employees', component: EmployeeList },
  { path: 'employees/add', component: EmployeeForm },
  { path: 'leaves', component: LeaveList },
  { path: 'leaves/apply', component: LeaveForm },
  { path: 'payroll', component: PayrollList },

{ path: 'reports', component: ReportSummary },
{ path: 'attendance', component: AttendanceList },
  { path: '**', redirectTo: 'login' },

];