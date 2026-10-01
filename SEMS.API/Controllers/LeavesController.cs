using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SEMS.API.Data;
using SEMS.API.DTOs;
using SEMS.API.Models;

namespace SEMS.API.Controllers
{
    [ApiController]
    [Route("api/leaves")]
    [Authorize]
    public class LeavesController : Controller
    {
        private readonly AppDbContext _context;

        private static readonly string[] AllowedTypes = { "Casual", "Sick", "Earned" };
        private static readonly string[] AllowedStatuses = { "Approved", "Rejected" };

        public LeavesController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var leaves = await _context.LeaveRequests
                .OrderByDescending(l => l.AppliedOn)
                .Select(l => new LeaveResponseDto
                {
                    Id = l.Id,
                    EmployeeId = l.EmployeeId,
                    EmployeeName = l.Employee != null ? l.Employee.FullName : "",
                    LeaveType = l.LeaveType,
                    FromDate = l.FromDate,
                    ToDate = l.ToDate,
                    Reason = l.Reason,
                    Status = l.Status,
                    AppliedOn = l.AppliedOn,
                    ReviewedOn = l.ReviewedOn
                })
                .ToListAsync();

            return Ok(leaves);
        }
        [HttpPost]
        public async Task<IActionResult> Apply(LeaveRequestDto dto)
        {
            if (!AllowedTypes.Contains(dto.LeaveType))
                return BadRequest(new { message = "LeaveType must be Casual, Sick or Earned" });

            if (dto.ToDate.Date < dto.FromDate.Date)
                return BadRequest(new { message = "ToDate cannot be before FromDate" });

            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId);
            if (!employeeExists)
                return BadRequest(new { message = "Employee not found" });

            var leave = new LeaveRequest
            {
                EmployeeId = dto.EmployeeId,
                LeaveType = dto.LeaveType,
                FromDate = dto.FromDate.Date,
                ToDate = dto.ToDate.Date,
                Reason = dto.Reason,
                Status = "Pending",
                AppliedOn = DateTime.UtcNow
            };

            _context.LeaveRequests.Add(leave);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Leave applied successfully", id = leave.Id });
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, LeaveStatusDto dto)
        {
            if (!AllowedStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Status must be Approved or Rejected" });

            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null)
                return NotFound(new { message = "Leave request not found" });

            if (leave.Status != "Pending")
                return BadRequest(new { message = "Only pending leaves can be reviewed" });

            leave.Status = dto.Status;
            leave.ReviewedOn = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Leave {dto.Status.ToLower()} successfully" });
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null)
                return NotFound(new { message = "Leave request not found" });

            if (leave.Status != "Pending")
                return BadRequest(new { message = "Only pending leaves can be deleted" });

            _context.LeaveRequests.Remove(leave);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Leave deleted successfully" });
        }
    }
}
