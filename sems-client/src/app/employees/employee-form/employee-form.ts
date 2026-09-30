import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeApi } from '../services/employee-api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm {
  employeeForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private employeeApi: EmployeeApi,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      joiningDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.employeeApi.create(this.employeeForm.value).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire('Success', 'Employee add ho gaya!', 'success');
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Employee add nahi ho paaya', 'error');
      }
    });
  }
}