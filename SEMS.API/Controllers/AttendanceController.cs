using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SEMS.API.Data;
using SEMS.API.DTOs;
using SEMS.API.Models;

namespace SEMS.API.Controllers
{
    [ApiController]
    [Route("api/attendance")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        private static readonly string[] AllowedStatuses = { "Present", "Absent", "Half Day" };

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/attendance?date=2026-10-01
        [HttpGet]
        public async Task<IActionResult> GetByDate([FromQuery] DateTime? date)
        {
            var day = (date ?? DateTime.Today).Date;

            var records = await _context.Attendances
                .Where(a => a.AttendanceDate == day)
                .OrderBy(a => a.Employee!.FullName)
                .Select(a => new AttendanceResponseDto
                {
                    Id = a.Id,
                    EmployeeId = a.EmployeeId,
                    EmployeeName = a.Employee != null ? a.Employee.FullName : "",
                    AttendanceDate = a.AttendanceDate,
                    CheckIn = a.CheckIn,
                    CheckOut = a.CheckOut,
                    Status = a.Status,
                    Remarks = a.Remarks
                })
                .ToListAsync();

            return Ok(records);
        }

        // POST api/attendance  (mark ya update: ek employee, ek din, ek entry)
        [HttpPost]
        public async Task<IActionResult> Mark(AttendanceDto dto)
        {
            if (!AllowedStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Status must be Present, Absent or Half Day" });

            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId);
            if (!employeeExists)
                return BadRequest(new { message = "Employee not found" });

            var day = dto.AttendanceDate.Date;

            var record = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == dto.EmployeeId && a.AttendanceDate == day);

            if (record == null)
            {
                record = new Attendance
                {
                    EmployeeId = dto.EmployeeId,
                    AttendanceDate = day,
                    Status = dto.Status,
                    Remarks = dto.Remarks
                };
                _context.Attendances.Add(record);
            }
            else
            {
                record.Status = dto.Status;
                record.Remarks = dto.Remarks;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Attendance saved", id = record.Id });
        }

        // POST api/attendance/1/check-in
        [HttpPost("{employeeId}/check-in")]
        public async Task<IActionResult> CheckIn(int employeeId)
        {
            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == employeeId);
            if (!employeeExists)
                return NotFound(new { message = "Employee not found" });

            var today = DateTime.Today;

            var record = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.AttendanceDate == today);

            if (record != null && record.CheckIn != null)
                return BadRequest(new { message = "Already checked in today" });

            if (record == null)
            {
                record = new Attendance
                {
                    EmployeeId = employeeId,
                    AttendanceDate = today,
                    Status = "Present"
                };
                _context.Attendances.Add(record);
            }

            record.CheckIn = DateTime.UtcNow;
            record.Status = "Present";

            await _context.SaveChangesAsync();
            return Ok(new { message = "Checked in successfully" });
        }

        // POST api/attendance/1/check-out
        [HttpPost("{employeeId}/check-out")]
        public async Task<IActionResult> CheckOut(int employeeId)
        {
            var today = DateTime.Today;

            var record = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.AttendanceDate == today);

            if (record == null || record.CheckIn == null)
                return BadRequest(new { message = "Please check in first" });

            if (record.CheckOut != null)
                return BadRequest(new { message = "Already checked out today" });

            record.CheckOut = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Checked out successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var record = await _context.Attendances.FindAsync(id);
            if (record == null)
                return NotFound(new { message = "Attendance record not found" });

            _context.Attendances.Remove(record);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Attendance deleted successfully" });
        }
    }
}