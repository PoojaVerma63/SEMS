import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { LeaveApi, LeaveResponse } from '../../employees/services/leave-api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leave-list.html',
  styleUrl: './leave-list.css'
})
export class LeaveList implements OnInit {
  leaves: LeaveResponse[] = [];
  loading = true;

  constructor(
    private leaveApi: LeaveApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading = true;
    this.leaveApi.getAll().subscribe({
      next: (data) => {
        this.leaves = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Leave load error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', `Leaves load nahi hui (status: ${err.status})`, 'error');
      }
    });
  }

  badgeClass(status: string): string {
    if (status === 'Approved') return 'bg-success';
    if (status === 'Rejected') return 'bg-danger';
    return 'bg-warning text-dark';
  }

  review(id: number, status: 'Approved' | 'Rejected'): void {
    Swal.fire({
      title: `${status} karein?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Haan'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.leaveApi.updateStatus(id, status).subscribe({
        next: () => {
          Swal.fire('Done', `Leave ${status.toLowerCase()} ho gayi`, 'success');
          this.loadLeaves();
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message || 'Status update nahi hua';
          Swal.fire('Error', msg, 'error');
        }
      });
    });
  }

  deleteLeave(id: number): void {
    Swal.fire({
      title: 'Sure?',
      text: 'Ye leave request delete ho jayegi',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Haan, delete karein'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.leaveApi.delete(id).subscribe({
        next: () => {
          Swal.fire('Deleted', 'Leave delete ho gayi', 'success');
          this.loadLeaves();
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message || 'Delete nahi ho paayi';
          Swal.fire('Error', msg, 'error');
        }
      });
    });
  }
}