namespace TuitionPlatform.Domain.Enums;

public enum PlacementStatus
{
    Active = 1,
    Paused = 2,
    Ended = 3
}

public enum PlacementEndReason
{
    TeacherLeft = 1,
    ParentStopped = 2,
    CourseCompleted = 3,
    ReplacedTeacher = 4,
    Other = 99
}

public enum ClassSessionStatus
{
    Scheduled = 1,
    Completed = 2,
    Cancelled = 3,
    NoShow = 4
}

public enum InvoiceStatus
{
    Pending = 1,
    Paid = 2,
    Overdue = 3,
    Waived = 4
}
