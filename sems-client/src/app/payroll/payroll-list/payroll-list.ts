import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeApi, Employee } from '../../employees/services/employee-api';
import { PayrollApi, PayrollResponse } from '../../employees/services/payroll-api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payroll-list.html',
  styleUrl: './payroll-list.css'
})
export class PayrollList implements OnInit {
  employees: Employee[] = [];
  records: PayrollResponse[] = [];
  months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  loading = true;
  saving = false;
  payrollForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private payrollApi: PayrollApi,
    private employeeApi: EmployeeApi,
    private cdr: ChangeDetectorRef
  ) {
    this.payrollForm = this.fb.group({
      employeeId: ['', Validators.required],
      basicSalary: [null, [Validators.required, Validators.min(1)]],
      allowances: [0, [Validators.required, Validators.min(0)]],
      deductions: [0, [Validators.required, Validators.min(0)]]
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

  // Backend time bina 'Z' ke aata hai (UTC), isliye Z jodke local time banate hain
  toLocal(value?: string): Date | null {
    if (!value) return null;
    return new Date(value.endsWith('Z') ? value : value + 'Z');
  }

  get netPreview(): number {
    const v = this.payrollForm.value;
    return (Number(v.basicSalary) || 0) + (Number(v.allowances) || 0) - (Number(v.deductions) || 0);
  }

  get monthName(): string {
    return this.months.find(m => m.value === Number(this.selectedMonth))?.name ?? '';
  }

  get totalNet(): number {
    return this.records.reduce((sum, r) => sum + r.netSalary, 0);
  }

  loadRecords(): void {
    this.loading = true;
    this.payrollApi.getByMonth(Number(this.selectedMonth), Number(this.selectedYear)).subscribe({
      next: (data: PayrollResponse[]) => {
        this.records = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Payroll load error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', `Payroll load nahi hui (status: ${err.status})`, 'error');
      }
    });
  }

  save(): void {
    if (this.payrollForm.invalid) {
      this.payrollForm.markAllAsTouched();
      Swal.fire('Check karo', 'Employee aur Basic Salary (0 se zyada) bharo', 'warning');
      return;
    }

    const v = this.payrollForm.value;
    this.saving = true;
    this.payrollApi.create({
      employeeId: Number(v.employeeId),
      payMonth: Number(this.selectedMonth),
      payYear: Number(this.selectedYear),
      basicSalary: Number(v.basicSalary),
      allowances: Number(v.allowances),
      deductions: Number(v.deductions)
    }).subscribe({
      next: () => {
        this.saving = false;
        Swal.fire('Done', 'Salary entry ban gayi', 'success');
        this.payrollForm.reset({ employeeId: '', basicSalary: null, allowances: 0, deductions: 0 });
        this.loadRecords();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.cdr.detectChanges();
        Swal.fire('Error', err.error?.message || 'Salary entry nahi bani', 'error');
      }
    });
  }

  markPaid(id: number): void {
    Swal.fire({
      title: 'Paid mark karein?',
      text: 'Iske baad ye entry delete nahi ho sakegi',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Haan'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.payrollApi.markPaid(id).subscribe({
        next: () => {
          Swal.fire('Done', 'Salary paid mark ho gayi', 'success');
          this.loadRecords();
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error', err.error?.message || 'Paid mark nahi hui', 'error');
        }
      });
    });
  }

  deleteRecord(id: number): void {
    Swal.fire({
      title: 'Sure?',
      text: 'Ye salary entry delete ho jayegi',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Haan, delete karein'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.payrollApi.delete(id).subscribe({
        next: () => {
          Swal.fire('Deleted', 'Entry delete ho gayi', 'success');
          this.loadRecords();
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire('Error', err.error?.message || 'Delete nahi hui', 'error');
        }
      });
    });
  }
}