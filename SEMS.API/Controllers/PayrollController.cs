using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SEMS.API.Data;
using SEMS.API.DTOs;
using SEMS.API.Models;

namespace SEMS.API.Controllers
{
    [ApiController]
    [Route("api/payroll")]
    [Authorize]
    public class PayrollController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PayrollController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/payroll?month=10&year=2026
        [HttpGet]
        public async Task<IActionResult> GetByMonth([FromQuery] int? month, [FromQuery] int? year)
        {
            var m = month ?? DateTime.Today.Month;
            var y = year ?? DateTime.Today.Year;

            var records = await _context.Payrolls
                .Where(p => p.PayMonth == m && p.PayYear == y)
                .OrderBy(p => p.Employee!.FullName)
                .Select(p => new PayrollResponseDto
                {
                    Id = p.Id,
                    EmployeeId = p.EmployeeId,
                    EmployeeName = p.Employee != null ? p.Employee.FullName : "",
                    PayMonth = p.PayMonth,
                    PayYear = p.PayYear,
                    BasicSalary = p.BasicSalary,
                    Allowances = p.Allowances,
                    Deductions = p.Deductions,
                    NetSalary = p.NetSalary,
                    Status = p.Status,
                    PaidOn = p.PaidOn
                })
                .ToListAsync();

            return Ok(records);
        }

        [HttpPost]
        public async Task<IActionResult> Create(PayrollDto dto)
        {
            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId);
            if (!employeeExists)
                return BadRequest(new { message = "Employee not found" });

            if (dto.Deductions > dto.BasicSalary + dto.Allowances)
                return BadRequest(new { message = "Deductions cannot be more than Basic + Allowances" });

            var alreadyExists = await _context.Payrolls.AnyAsync(p =>
                p.EmployeeId == dto.EmployeeId &&
                p.PayMonth == dto.PayMonth &&
                p.PayYear == dto.PayYear);
            if (alreadyExists)
                return BadRequest(new { message = "Salary for this employee and month already exists" });

            var payroll = new Payroll
            {
                EmployeeId = dto.EmployeeId,
                PayMonth = dto.PayMonth,
                PayYear = dto.PayYear,
                BasicSalary = dto.BasicSalary,
                Allowances = dto.Allowances,
                Deductions = dto.Deductions,
                NetSalary = dto.BasicSalary + dto.Allowances - dto.Deductions,
                Status = "Pending"
            };

            _context.Payrolls.Add(payroll);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Salary entry created", id = payroll.Id });
        }

        // PUT api/payroll/1/pay
        [HttpPut("{id}/pay")]
        public async Task<IActionResult> MarkPaid(int id)
        {
            var payroll = await _context.Payrolls.FindAsync(id);
            if (payroll == null)
                return NotFound(new { message = "Payroll record not found" });

            if (payroll.Status == "Paid")
                return BadRequest(new { message = "Already paid" });

            payroll.Status = "Paid";
            payroll.PaidOn = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Marked as paid" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var payroll = await _context.Payrolls.FindAsync(id);
            if (payroll == null)
                return NotFound(new { message = "Payroll record not found" });

            if (payroll.Status == "Paid")
                return BadRequest(new { message = "Paid salary cannot be deleted" });

            _context.Payrolls.Remove(payroll);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payroll record deleted" });
        }
    }
}