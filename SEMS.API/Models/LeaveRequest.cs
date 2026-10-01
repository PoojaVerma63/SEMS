namespace SEMS.API.Models
{
    public class LeaveRequest
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string LeaveType { get; set; } = string.Empty;
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string? Reason { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime AppliedOn { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedOn { get; set; }

        public Employee? Employee { get; set; }
    }
}