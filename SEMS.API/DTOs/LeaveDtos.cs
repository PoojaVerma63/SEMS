using System.ComponentModel.DataAnnotations;

namespace SEMS.API.DTOs
{
    public class LeaveRequestDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public string LeaveType { get; set; } = string.Empty;

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        public string? Reason { get; set; }
    }
    public class LeaveStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }

    public class LeaveResponseDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string? Reason { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime AppliedOn { get; set; }
        public DateTime? ReviewedOn { get; set; }
    }
}
