import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeApi, Employee } from '../../employees/services/employee-api';
import { LeaveApi } from '../../employees/services/leave-api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './leave-form.html',
  styleUrl: './leave-form.css'
})
export class LeaveForm implements OnInit {
  leaveForm: FormGroup;
  employees: Employee[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private leaveApi: LeaveApi,
    private employeeApi: EmployeeApi,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.leaveForm = this.fb.group({
      employeeId: ['', Validators.required],
      leaveType: ['Casual', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      reason: ['']
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
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      Swal.fire('Check karo', 'Saare required fields bharo', 'warning');
      return;
    }

    const value = this.leaveForm.value;

    if (value.toDate < value.fromDate) {
      Swal.fire('Check karo', 'To Date, From Date se pehle nahi ho sakti', 'warning');
      return;
    }

    this.loading = true;
    this.leaveApi.apply({
      employeeId: Number(value.employeeId),
      leaveType: value.leaveType,
      fromDate: value.fromDate,
      toDate: value.toDate,
      reason: value.reason
    }).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Done', 'Leave apply ho gayi', 'success');
        this.router.navigate(['/leaves']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Apply error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        const msg = err.error?.message || `Leave apply nahi hui (status: ${err.status})`;
        Swal.fire('Error', msg, 'error');
      }
    });
  }
}