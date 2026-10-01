import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ReportApi, DashboardSummary, DepartmentCount } from '../../employees/services/report-api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-summary.html',
  styleUrl: './report-summary.css'
})
export class ReportSummary implements OnInit {
  summary: DashboardSummary | null = null;
  departments: DepartmentCount[] = [];
  loading = true;
  today = new Date();

  constructor(
    private reportApi: ReportApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    forkJoin({
      summary: this.reportApi.getSummary(),
      departments: this.reportApi.getDepartmentWise()
    }).subscribe({
      next: (res: { summary: DashboardSummary; departments: DepartmentCount[] }) => {
        this.summary = res.summary;
        this.departments = res.departments;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Reports load error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Error', `Reports load nahi hui (status: ${err.status})`, 'error');
      }
    });
  }

  percent(count: number): number {
    const total = this.summary?.totalEmployees ?? 0;
    return total > 0 ? Math.round((count * 100) / total) : 0;
  }
}