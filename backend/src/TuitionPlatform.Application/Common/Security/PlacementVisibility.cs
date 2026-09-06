using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Common.Security;

/// <summary>
/// Decides how much of a placement's money breakdown a teacher may see.
///
/// Online: the teacher and parent never meet, so the platform's margin stays private and the
/// teacher sees only their own payout.
/// Offline/Hybrid: the teacher goes to the parent's home and will learn the real fee within a
/// week. Hiding it there doesn't protect the margin, it just looks dishonest when discovered —
/// so the full breakdown is shown.
/// </summary>
public static class PlacementVisibility
{
    public static bool CanTeacherSeeFullFee(Placement placement)
        => placement.Mode != TeachingMode.Online;
}
