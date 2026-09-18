using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Common.Security;

/// <summary>
/// Single source of truth for who may see a parent's phone number. AutoMapper never
/// maps this field automatically (see ApplicationProfile) — every call site must go
/// through here so the commission paywall can't be bypassed by a new/forgotten mapping.
/// </summary>
public static class ContactVisibility
{
    /// <summary>
    /// Admins, the post owner, and a teacher unlock the number only after
    /// IsPaymentVerified is set by an admin (see VerifyPaymentAsync).
    /// </summary>
    public static bool ForApplication(User requester, TeacherApplication application)
    {
        if (requester.Role == UserRole.Admin || requester.Id == application.TuitionPost.CreatedByUserId)
        {
            return true;
        }

        return requester.Role == UserRole.Teacher
               && application.IsPaymentVerified
               && application.TeacherProfile.UserId == requester.Id;
    }
}
