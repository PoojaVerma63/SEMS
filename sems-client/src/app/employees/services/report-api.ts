import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  approvedLeavesThisMonth: number;
  payrollPendingCount: number;
  payrollPaidCount: number;
  payrollPaidAmount: number;
  payrollPendingAmount: number;
}

export interface DepartmentCount {
  department: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportApi {
  private baseUrl = 'http://localhost:5101/api/reports';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }

  getDepartmentWise(): Observable<DepartmentCount[]> {
    return this.http.get<DepartmentCount[]>(`${this.baseUrl}/department-wise`);
  }
}