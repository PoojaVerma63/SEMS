import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveRequest {
  employeeId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
}

export interface LeaveResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason?: string;
  status: string;
  appliedOn: string;
  reviewedOn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveApi {
  private baseUrl = 'http://localhost:5101/api/leaves';

  constructor(private http: HttpClient) {}

  getAll(): Observable<LeaveResponse[]> {
    return this.http.get<LeaveResponse[]>(this.baseUrl);
  }

  apply(leave: LeaveRequest): Observable<any> {
    return this.http.post(this.baseUrl, leave);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}