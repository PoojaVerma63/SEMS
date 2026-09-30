namespace SEMS.API.DTOs
{
    public class EmployeeDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public DateTime JoiningDate { get; set; }
        public string Status { get; set; } = "Active";
    }
}