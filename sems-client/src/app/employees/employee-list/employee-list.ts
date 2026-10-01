import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeApi, Employee } from '../services/employee-api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {
  employees: Employee[] = [];
  loading = true;

  constructor(
    private employeeApi: EmployeeApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeApi.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', `Employees load nahi ho paaye (status: ${err.status})`, 'error');
      }
    });
  }

  deleteEmployee(id: number | undefined): void {
    if (!id) return;
    Swal.fire({
      title: 'Sure?',
      text: 'Ye employee delete ho jayega',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Haan, delete karein'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeApi.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Employee delete ho gaya', 'success');
            this.loadEmployees();
          },
          error: (err) => {
            console.error('Delete error:', err);
            Swal.fire('Error', 'Delete nahi ho paaya', 'error');
          }
        });
      }
    });
  }
}