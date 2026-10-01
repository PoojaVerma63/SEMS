import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeApi, Employee } from '../../employees/services/employee-api';
import { AttendanceApi, AttendanceResponse } from '../../employees/services/attendance-api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.css'
})
export class AttendanceList implements OnInit {
  employees: Employee[] = [];
  records: AttendanceResponse[] = [];
  selectedDate = this.today();
  loading = true;
  saving = false;
  markForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private attendanceApi: AttendanceApi,
    private employeeApi: EmployeeApi,
    private cdr: ChangeDetectorRef
  ) {
    this.markForm = this.fb.group({
      employeeId: ['', Validators.required],
      status: ['Present', Validators.required],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.employeeApi.getAll().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Employees load error:', err);
        Swal.fire('Error', 'Employees list load nahi hui', 'error');
      }
    });
    this.loadRecords();
  }

  // yyyy-MM-dd (local date)
  private today(): string {
    return new Date().toLocaleDateString('en-CA');
  }

  // Backend time bina 'Z' ke aata hai (UTC hai), isliye Z jodke local time banate hain
  toLocal(value?: string): Date | null {
    if (!value) return null;
    return new Date(value.endsWith('Z') ? value : value + 'Z');
  }

  badgeClass(status: string): string {
    if (status === 'Present') return 'bg-success';
    if (status === 'Absent') return 'bg-danger';
    return 'bg-warning text-dark';
  }

  loadRecords(): void {
    this.loading = true;
    this.attendanceApi.getByDate(this.selectedDate).subscribe({
      next: (data: AttendanceResponse[]) => {
        this.records = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Attendance load error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', `Attendance load nahi hui (status: ${err.status})`, 'error');
      }
    });
  }

  onDateChange(): void {
    this.loadRecords();
  }

  save(): void {
    if (this.markForm.invalid) {
      this.markForm.markAllAsTouched();
      Swal.fire('Check karo', 'Employee select karo', 'warning');
      return;
    }

    const v = this.markForm.value;
    this.saving = true;
    this.attendanceApi.mark({
      employeeId: Number(v.employeeId),
      attendanceDate: this.selectedDate,
      status: v.status,
      remarks: v.remarks
    }).subscribe({
      next: () => {
        this.saving = false;
        Swal.fire('Done', 'Attendance save ho gayi', 'success');
        this.loadRecords();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.cdr.detectChanges();
        Swal.fire('Error', err.error?.message || 'Save nahi hui', 'error');
      }
    });
  }

  checkIn(): void {
    const id = Number(this.markForm.value.employeeId);
    if (!id) {
      Swal.fire('Check karo', 'Pehle employee select karo', 'warning');
      return;
    }
    this.attendanceApi.checkIn(id).subscribe({
      next: () => {
        Swal.fire('Done', 'Check-in ho gaya', 'success');
        this.selectedDate = this.today();
        this.loadRecords();
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Error', err.error?.message || 'Check-in nahi hua', 'error');
      }
    });
  }

  checkOut(): void {
    const id = Number(this.markForm.value.employeeId);
    if (!id) {
      Swal.fire('Check karo', 'Pehle employee select karo', 'warning');
      return;
    }
    this.attendanceApi.checkOut(id).subscribe({
      next: () => {
        Swal.fire('Done', 'Check-out ho gaya', 'success');
        this.selectedDate = this.today();
        this.loadRecords();
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire('Error', err.error?.message || 'Check-out nahi hua', 'error');
      }
    });
  }

  deleteRecord(id: number): void {
    Swal.fire({
      title: 'Sure?',
      text: 'Ye attendance record delete ho jayega',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Haan, delete karein'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.attendanceApi.delete(id).subscribe({
        next: () => {
          Swal.fire('Deleted', 'Record delete ho gaya', 'success');
          this.loadRecords();
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error', err.error?.message || 'Delete nahi hua', 'error');
        }
      });
    });
  }
}