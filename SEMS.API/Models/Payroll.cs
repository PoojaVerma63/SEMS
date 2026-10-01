namespace SEMS.API.Models
{
    public class Payroll
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int PayMonth { get; set; }
        public int PayYear { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime? PaidOn { get; set; }

        public Employee? Employee { get; set; }
    }
}