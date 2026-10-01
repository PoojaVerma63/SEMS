namespace SEMS.API.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalEmployees { get; set; }
        public int ActiveEmployees { get; set; }
        public int InactiveEmployees { get; set; }
        public int PresentToday { get; set; }
        public int AbsentToday { get; set; }
        public int PendingLeaves { get; set; }
        public int ApprovedLeavesThisMonth { get; set; }
        public int PayrollPendingCount { get; set; }
        public int PayrollPaidCount { get; set; }
        public decimal PayrollPaidAmount { get; set; }
        public decimal PayrollPendingAmount { get; set; }
    }

    public class DepartmentCountDto
    {
        public string Department { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}