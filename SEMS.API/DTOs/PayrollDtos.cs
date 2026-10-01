using System.ComponentModel.DataAnnotations;

namespace SEMS.API.DTOs
{
    // Salary entry banane ke liye (Angular se aayega)
    public class PayrollDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Range(1, 12)]
        public int PayMonth { get; set; }

        [Range(2000, 2100)]
        public int PayYear { get; set; }

        [Range(0.01, 100000000)]
        public decimal BasicSalary { get; set; }

        [Range(0, 100000000)]
        public decimal Allowances { get; set; }

        [Range(0, 100000000)]
        public decimal Deductions { get; set; }
    }

    // List mein dikhane ke liye
    public class PayrollResponseDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int PayMonth { get; set; }
        public int PayYear { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? PaidOn { get; set; }
    }
}