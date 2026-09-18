using AutoMapper;
using Moq;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Application.Mapping;
using TuitionPlatform.Application.Services.Teachers;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;
using Xunit;

namespace TuitionPlatform.Application.Tests.Services.Teachers;

public class TeacherServiceTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<ITeacherProfileRepository> _teacherProfileRepository = new();
    private readonly Mock<ITuitionPostRepository> _tuitionPostRepository = new();
    private readonly Mock<ITeacherApplicationRepository> _applicationRepository = new();
    private readonly Mock<IReviewRepository> _reviewRepository = new();
    private readonly Mock<INotificationService> _notificationService = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly IMapper _mapper;

    public TeacherServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<ApplicationProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    private TeacherService CreateSut() => new(
        _userRepository.Object,
        _teacherProfileRepository.Object,
        _tuitionPostRepository.Object,
        _applicationRepository.Object,
        _reviewRepository.Object,
        _notificationService.Object,
        _unitOfWork.Object,
        _mapper);

    private (Guid userId, TeacherProfile profile) SetUpApprovedTeacher(bool isApproved)
    {
        var userId = Guid.NewGuid();
        var profile = new TeacherProfile { Id = Guid.NewGuid(), UserId = userId, IsApproved = isApproved };
        _teacherProfileRepository.Setup(r => r.GetByUserIdAsync(userId, It.IsAny<CancellationToken>())).ReturnsAsync(profile);
        return (userId, profile);
    }

    // Previously ApplyToPostAsync never checked IsApproved at all — an unapproved teacher's
    // profile could apply to vacancies before an admin ever reviewed them.
    [Fact]
    public async Task ApplyToPostAsync_UnapprovedTeacher_ThrowsForbidden()
    {
        var (userId, _) = SetUpApprovedTeacher(isApproved: false);
        var sut = CreateSut();

        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.ApplyToPostAsync(userId, new CreateTeacherApplicationRequest { TuitionPostId = Guid.NewGuid() }));
    }

    [Fact]
    public async Task ApplyToPostAsync_PostNotOpenOrApproved_ThrowsForbidden()
    {
        var (userId, _) = SetUpApprovedTeacher(isApproved: true);
        var post = new TuitionPost { Id = Guid.NewGuid(), Status = TuitionPostStatus.Closed };
        _tuitionPostRepository.Setup(r => r.GetByIdAsync(post.Id, It.IsAny<CancellationToken>())).ReturnsAsync(post);

        var sut = CreateSut();
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.ApplyToPostAsync(userId, new CreateTeacherApplicationRequest { TuitionPostId = post.Id }));
    }

    // Previously unguarded: nothing stopped the same teacher applying to the same post any number
    // of times, spamming the parent's application list.
    [Fact]
    public async Task ApplyToPostAsync_AlreadyApplied_ThrowsForbidden()
    {
        var (userId, profile) = SetUpApprovedTeacher(isApproved: true);
        var post = new TuitionPost { Id = Guid.NewGuid(), Status = TuitionPostStatus.Open, CreatedByUserId = Guid.NewGuid() };
        _tuitionPostRepository.Setup(r => r.GetByIdAsync(post.Id, It.IsAny<CancellationToken>())).ReturnsAsync(post);

        var existingApplication = new TeacherApplication { TeacherProfileId = profile.Id, TuitionPostId = post.Id };
        _applicationRepository.Setup(r => r.GetByTeacherIdAsync(profile.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new[] { existingApplication });

        var sut = CreateSut();
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.ApplyToPostAsync(userId, new CreateTeacherApplicationRequest { TuitionPostId = post.Id }));
    }

    [Fact]
    public async Task ApplyToPostAsync_ApprovedTeacherOpenPostNoDuplicate_Succeeds()
    {
        var (userId, profile) = SetUpApprovedTeacher(isApproved: true);
        var post = new TuitionPost { Id = Guid.NewGuid(), Status = TuitionPostStatus.Open, CreatedByUserId = Guid.NewGuid(), Subject = "Math" };
        _tuitionPostRepository.Setup(r => r.GetByIdAsync(post.Id, It.IsAny<CancellationToken>())).ReturnsAsync(post);
        _applicationRepository.Setup(r => r.GetByTeacherIdAsync(profile.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Array.Empty<TeacherApplication>());

        var sut = CreateSut();
        var result = await sut.ApplyToPostAsync(userId, new CreateTeacherApplicationRequest { TuitionPostId = post.Id, Message = "Hi" });

        Assert.Equal(profile.Id, result.TeacherProfileId);
        _applicationRepository.Verify(r => r.AddAsync(It.IsAny<TeacherApplication>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
