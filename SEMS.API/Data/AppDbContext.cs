using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SEMS.API.Models;

namespace SEMS.API.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Payroll> Payrolls { get; set; }
    }
}