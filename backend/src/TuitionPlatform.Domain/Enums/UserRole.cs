namespace TuitionPlatform.Domain.Enums;

public enum UserRole
{
    Teacher = 1,
    Admin = 2,
    // Parent covers both parents and students booking tuition — one role for now (see ParentProfile).
    Parent = 3
}
