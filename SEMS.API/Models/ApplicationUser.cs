using Microsoft.AspNetCore.Identity;

namespace SEMS.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Employee"; // Admin, HR, Employee
    }
}