import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PayrollRequest {
  employeeId: number;
  payMonth: number;
  payYear: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
}

export interface PayrollResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  payMonth: number;
  payYear: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
  paidOn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayrollApi {
  private baseUrl = 'http://localhost:5101/api/payroll';

  constructor(private http: HttpClient) {}

  getByMonth(month: number, year: number): Observable<PayrollResponse[]> {
    return this.http.get<PayrollResponse[]>(`${this.baseUrl}?month=${month}&year=${year}`);
  }

  create(data: PayrollRequest): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  markPaid(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/pay`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}