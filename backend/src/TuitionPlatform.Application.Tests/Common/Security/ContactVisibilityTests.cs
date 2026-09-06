using TuitionPlatform.Application.Common.Security;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;
using Xunit;

namespace TuitionPlatform.Application.Tests.Common.Security;

// This is the exact rule that a duplicate, unmasked implementation used to bypass entirely
// (TeacherService.GetMyApplicationsAsync leaked every parent's phone number for free). Locking
// the rule itself down in a unit test means a future duplicate can't silently reintroduce that.
public class ContactVisibilityTests
{
    private static TeacherApplication BuildApplication(Guid postOwnerId, Guid teacherUserId, bool isPaymentVerified)
    {
        var teacherProfile = new TeacherProfile { Id = Guid.NewGuid(), UserId = teacherUserId };
        var post = new TuitionPost { Id = Guid.NewGuid(), CreatedByUserId = postOwnerId, ParentPhoneNumber = "9800000000" };
        return new TeacherApplication
        {
            TeacherProfile = teacherProfile,
            TuitionPost = post,
            IsPaymentVerified = isPaymentVerified
        };
    }

    [Fact]
    public void ForApplication_Admin_AlwaysSeesContact()
    {
        var admin = new User { Id = Guid.NewGuid(), Role = UserRole.Admin };
        var application = BuildApplication(Guid.NewGuid(), Guid.NewGuid(), isPaymentVerified: false);

        Assert.True(ContactVisibility.ForApplication(admin, application));
    }

    [Fact]
    public void ForApplication_PostOwner_AlwaysSeesOwnContact()
    {
        var postOwnerId = Guid.NewGuid();
        var owner = new User { Id = postOwnerId, Role = UserRole.Parent };
        var application = BuildApplication(postOwnerId, Guid.NewGuid(), isPaymentVerified: false);

        Assert.True(ContactVisibility.ForApplication(owner, application));
    }

    [Fact]
    public void ForApplication_UnverifiedTeacher_CannotSeeContact()
    {
        var teacherUserId = Guid.NewGuid();
        var teacher = new User { Id = teacherUserId, Role = UserRole.Teacher };
        var application = BuildApplication(Guid.NewGuid(), teacherUserId, isPaymentVerified: false);

        Assert.False(ContactVisibility.ForApplication(teacher, application));
    }

    [Fact]
    public void ForApplication_PaymentVerifiedTeacher_CanSeeOwnContact()
    {
        var teacherUserId = Guid.NewGuid();
        var teacher = new User { Id = teacherUserId, Role = UserRole.Teacher };
        var application = BuildApplication(Guid.NewGuid(), teacherUserId, isPaymentVerified: true);

        Assert.True(ContactVisibility.ForApplication(teacher, application));
    }

    // The exact exploit: a DIFFERENT teacher (not the applicant) must never see the contact, even
    // if some other application on the same post happens to be payment-verified.
    [Fact]
    public void ForApplication_PaymentVerifiedButDifferentTeacher_CannotSeeContact()
    {
        var applicantTeacherUserId = Guid.NewGuid();
        var otherTeacher = new User { Id = Guid.NewGuid(), Role = UserRole.Teacher };
        var application = BuildApplication(Guid.NewGuid(), applicantTeacherUserId, isPaymentVerified: true);

        Assert.False(ContactVisibility.ForApplication(otherTeacher, application));
    }

    [Fact]
    public void ForApplication_UnrelatedParent_CannotSeeContact()
    {
        var unrelatedParent = new User { Id = Guid.NewGuid(), Role = UserRole.Parent };
        var application = BuildApplication(Guid.NewGuid(), Guid.NewGuid(), isPaymentVerified: false);

        Assert.False(ContactVisibility.ForApplication(unrelatedParent, application));
    }
}
