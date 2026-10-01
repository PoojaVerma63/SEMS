namespace SEMS.API.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; }
        public string Status { get; set; } = "Present";
        public string? Remarks { get; set; }

        public Employee? Employee { get; set; }
    }
}