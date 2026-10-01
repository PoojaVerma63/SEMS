import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceRequest {
  employeeId: number;
  attendanceDate: string;
  status: string;
  remarks?: string;
}

export interface AttendanceResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  remarks?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceApi {
  private baseUrl = 'http://localhost:5101/api/attendance';

  constructor(private http: HttpClient) {}

  getByDate(date: string): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.baseUrl}?date=${date}`);
  }

  mark(data: AttendanceRequest): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  checkIn(employeeId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${employeeId}/check-in`, {});
  }

  checkOut(employeeId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${employeeId}/check-out`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}