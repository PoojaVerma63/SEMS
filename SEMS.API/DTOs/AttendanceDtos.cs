using System.ComponentModel.DataAnnotations;

namespace SEMS.API.DTOs
{
    // Attendance mark karne ke liye
    public class AttendanceDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime AttendanceDate { get; set; }

        [Required]
        public string Status { get; set; } = "Present";

        public string? Remarks { get; set; }
    }

    // List mein dikhane ke liye
    public class AttendanceResponseDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime AttendanceDate { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Remarks { get; set; }
    }
}