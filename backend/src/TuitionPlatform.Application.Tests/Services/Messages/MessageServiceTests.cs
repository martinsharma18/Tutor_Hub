using AutoMapper;
using Moq;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Messages;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Application.Mapping;
using TuitionPlatform.Application.Services.Messages;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;
using Xunit;

namespace TuitionPlatform.Application.Tests.Services.Messages;

/// <summary>
/// These cover the rule that makes the whole managed-placement model enforceable. Direct
/// parent-teacher chat used to open the moment a teacher applied, which let a teacher ask for the
/// parent's number and skip the commission entirely. If a future change reopens that path, these
/// tests should fail.
/// </summary>
public class MessageServiceTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<IMessageRepository> _messageRepository = new();
    private readonly Mock<IPlacementRepository> _placementRepository = new();
    private readonly Mock<ITeacherProfileRepository> _teacherProfileRepository = new();
    private readonly Mock<INotificationService> _notificationService = new();
    private readonly Mock<IRealtimeNotifier> _realtimeNotifier = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly IMapper _mapper;

    public MessageServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<ApplicationProfile>());
        _mapper = mapperConfig.CreateMapper();

        _messageRepository
            .Setup(r => r.GetConversationKeyAsync(It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(Guid.NewGuid());
    }

    private MessageService CreateSut() => new(
        _userRepository.Object,
        _messageRepository.Object,
        _placementRepository.Object,
        _teacherProfileRepository.Object,
        _notificationService.Object,
        _realtimeNotifier.Object,
        _unitOfWork.Object,
        _mapper);

    private (User parent, User teacher) SetUpPair()
    {
        var parent = new User { Id = Guid.NewGuid(), Role = UserRole.Parent, FullName = "A Parent" };
        var teacher = new User { Id = Guid.NewGuid(), Role = UserRole.Teacher, FullName = "A Teacher" };
        _userRepository.Setup(r => r.GetByIdAsync(parent.Id, It.IsAny<CancellationToken>())).ReturnsAsync(parent);
        _userRepository.Setup(r => r.GetByIdAsync(teacher.Id, It.IsAny<CancellationToken>())).ReturnsAsync(teacher);
        return (parent, teacher);
    }

    [Fact]
    public async Task SendMessageAsync_TeacherToParent_WithoutPlacement_IsBlocked()
    {
        var (parent, teacher) = SetUpPair();
        _placementRepository
            .Setup(r => r.HasLivePlacementBetweenAsync(parent.Id, teacher.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var sut = CreateSut();
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.SendMessageAsync(teacher.Id, new SendMessageRequest { ReceiverId = parent.Id, Body = "send me your number" }));
    }

    [Fact]
    public async Task SendMessageAsync_ParentToTeacher_WithoutPlacement_IsBlocked()
    {
        var (parent, teacher) = SetUpPair();
        _placementRepository
            .Setup(r => r.HasLivePlacementBetweenAsync(parent.Id, teacher.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var sut = CreateSut();
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.SendMessageAsync(parent.Id, new SendMessageRequest { ReceiverId = teacher.Id, Body = "hello" }));
    }

    [Fact]
    public async Task SendMessageAsync_WithLivePlacement_IsAllowed()
    {
        var (parent, teacher) = SetUpPair();
        _placementRepository
            .Setup(r => r.HasLivePlacementBetweenAsync(parent.Id, teacher.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var sut = CreateSut();
        var result = await sut.SendMessageAsync(teacher.Id, new SendMessageRequest { ReceiverId = parent.Id, Body = "Running 5 minutes late" });

        Assert.Equal("Running 5 minutes late", result.Body);
        _messageRepository.Verify(r => r.AddAsync(It.IsAny<Message>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    // Admin is the intended channel before a tuition exists, so it must never be gated.
    [Fact]
    public async Task SendMessageAsync_AdminToAnyone_IsAlwaysAllowed()
    {
        var admin = new User { Id = Guid.NewGuid(), Role = UserRole.Admin, FullName = "Admin" };
        var teacher = new User { Id = Guid.NewGuid(), Role = UserRole.Teacher, FullName = "A Teacher" };
        _userRepository.Setup(r => r.GetByIdAsync(admin.Id, It.IsAny<CancellationToken>())).ReturnsAsync(admin);
        _userRepository.Setup(r => r.GetByIdAsync(teacher.Id, It.IsAny<CancellationToken>())).ReturnsAsync(teacher);

        var sut = CreateSut();
        var result = await sut.SendMessageAsync(admin.Id, new SendMessageRequest { ReceiverId = teacher.Id, Body = "New assignment for you" });

        Assert.Equal("New assignment for you", result.Body);
        _placementRepository.Verify(
            r => r.HasLivePlacementBetweenAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task SendMessageAsync_ParentToAdmin_IsAlwaysAllowed()
    {
        var parent = new User { Id = Guid.NewGuid(), Role = UserRole.Parent, FullName = "A Parent" };
        var admin = new User { Id = Guid.NewGuid(), Role = UserRole.Admin, FullName = "Admin" };
        _userRepository.Setup(r => r.GetByIdAsync(parent.Id, It.IsAny<CancellationToken>())).ReturnsAsync(parent);
        _userRepository.Setup(r => r.GetByIdAsync(admin.Id, It.IsAny<CancellationToken>())).ReturnsAsync(admin);

        var sut = CreateSut();
        var result = await sut.SendMessageAsync(parent.Id, new SendMessageRequest { ReceiverId = admin.Id, Body = "Can you find me a maths tutor?" });

        Assert.Equal("Can you find me a maths tutor?", result.Body);
    }
}
