using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SEMS.API.Data;
using SEMS.API.DTOs;

namespace SEMS.API.Controllers
{
    [ApiController]
    [Route("api/reports")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/reports/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var today = DateTime.Today;
            var month = today.Month;
            var year = today.Year;

            var summary = new DashboardSummaryDto
            {
                TotalEmployees = await _context.Employees.CountAsync(),
                ActiveEmployees = await _context.Employees.CountAsync(e => e.Status == "Active"),
                InactiveEmployees = await _context.Employees.CountAsync(e => e.Status == "Inactive"),

                PresentToday = await _context.Attendances
                    .CountAsync(a => a.AttendanceDate == today && a.Status == "Present"),
                AbsentToday = await _context.Attendances
                    .CountAsync(a => a.AttendanceDate == today && a.Status == "Absent"),

                PendingLeaves = await _context.LeaveRequests
                    .CountAsync(l => l.Status == "Pending"),
                ApprovedLeavesThisMonth = await _context.LeaveRequests
                    .CountAsync(l => l.Status == "Approved"
                                  && l.FromDate.Month == month
                                  && l.FromDate.Year == year),

                PayrollPendingCount = await _context.Payrolls
                    .CountAsync(p => p.PayMonth == month && p.PayYear == year && p.Status == "Pending"),
                PayrollPaidCount = await _context.Payrolls
                    .CountAsync(p => p.PayMonth == month && p.PayYear == year && p.Status == "Paid"),
                PayrollPaidAmount = await _context.Payrolls
                    .Where(p => p.PayMonth == month && p.PayYear == year && p.Status == "Paid")
                    .SumAsync(p => p.NetSalary),
                PayrollPendingAmount = await _context.Payrolls
                    .Where(p => p.PayMonth == month && p.PayYear == year && p.Status == "Pending")
                    .SumAsync(p => p.NetSalary)
            };

            return Ok(summary);
        }

        // GET api/reports/department-wise
        [HttpGet("department-wise")]
        public async Task<IActionResult> GetDepartmentWise()
        {
            var data = await _context.Employees
                .GroupBy(e => e.Department)
                .Select(g => new DepartmentCountDto
                {
                    Department = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(d => d.Count)
                .ToListAsync();

            return Ok(data);
        }
    }
}