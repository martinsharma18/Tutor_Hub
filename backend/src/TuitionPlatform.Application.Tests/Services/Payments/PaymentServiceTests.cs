using AutoMapper;
using Moq;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Payments;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Application.Mapping;
using TuitionPlatform.Application.Services.Payments;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;
using Xunit;

namespace TuitionPlatform.Application.Tests.Services.Payments;

public class PaymentServiceTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<ITuitionPostRepository> _tuitionPostRepository = new();
    private readonly Mock<IPaymentRepository> _paymentRepository = new();
    private readonly Mock<IAdminSettingsRepository> _adminSettingsRepository = new();
    private readonly Mock<INotificationService> _notificationService = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly IMapper _mapper;

    public PaymentServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<ApplicationProfile>());
        _mapper = mapperConfig.CreateMapper();
    }

    private PaymentService CreateSut() => new(
        _userRepository.Object,
        _tuitionPostRepository.Object,
        _paymentRepository.Object,
        _adminSettingsRepository.Object,
        _notificationService.Object,
        _unitOfWork.Object,
        _mapper);

    [Fact]
    public async Task CreateCommissionAsync_NonAdmin_ThrowsForbidden()
    {
        var nonAdmin = new User { Id = Guid.NewGuid(), Role = UserRole.Teacher };
        _userRepository.Setup(r => r.GetByIdAsync(nonAdmin.Id, It.IsAny<CancellationToken>())).ReturnsAsync(nonAdmin);

        var sut = CreateSut();
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.CreateCommissionAsync(nonAdmin.Id, new CreatePaymentRequest { Amount = 1000 }));
    }

    [Fact]
    public async Task CreateCommissionAsync_PercentageOnly_ComputesCommissionFromPercentage()
    {
        var admin = new User { Id = Guid.NewGuid(), Role = UserRole.Admin };
        var teacher = new User { Id = Guid.NewGuid(), Role = UserRole.Teacher };
        var post = new TuitionPost { Id = Guid.NewGuid(), CreatedByUserId = Guid.NewGuid() };

        _userRepository.Setup(r => r.GetByIdAsync(admin.Id, It.IsAny<CancellationToken>())).ReturnsAsync(admin);
        _userRepository.Setup(r => r.GetByIdAsync(teacher.Id, It.IsAny<CancellationToken>())).ReturnsAsync(teacher);
        _tuitionPostRepository.Setup(r => r.GetByIdAsync(post.Id, It.IsAny<CancellationToken>())).ReturnsAsync(post);
        _adminSettingsRepository.Setup(r => r.GetSettingsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new AdminSettings { CommissionPercentage = 15m, FlatCommissionAmount = null });

        Payment? captured = null;
        _paymentRepository
            .Setup(r => r.AddAsync(It.IsAny<Payment>(), It.IsAny<CancellationToken>()))
            .Callback<Payment, CancellationToken>((p, _) => captured = p)
            .Returns(Task.CompletedTask);

        var sut = CreateSut();
        await sut.CreateCommissionAsync(admin.Id, new CreatePaymentRequest
        {
            TuitionPostId = post.Id,
            TeacherId = teacher.Id,
            Amount = 1000m
        });

        Assert.NotNull(captured);
        Assert.Equal(150m, captured!.CommissionAmount);       // 15% of 1000
        Assert.Equal(850m, captured.TeacherNetAmount);         // 1000 - 150
    }

    [Fact]
    public async Task CreateCommissionAsync_FlatAmountSet_OverridesPercentage()
    {
        var admin = new User { Id = Guid.NewGuid(), Role = UserRole.Admin };
        var teacher = new User { Id = Guid.NewGuid(), Role = UserRole.Teacher };
        var post = new TuitionPost { Id = Guid.NewGuid(), CreatedByUserId = Guid.NewGuid() };

        _userRepository.Setup(r => r.GetByIdAsync(admin.Id, It.IsAny<CancellationToken>())).ReturnsAsync(admin);
        _userRepository.Setup(r => r.GetByIdAsync(teacher.Id, It.IsAny<CancellationToken>())).ReturnsAsync(teacher);
        _tuitionPostRepository.Setup(r => r.GetByIdAsync(post.Id, It.IsAny<CancellationToken>())).ReturnsAsync(post);
        // Flat amount is set alongside a percentage — flat must win (matches CreateCommissionAsync's ?? logic).
        _adminSettingsRepository.Setup(r => r.GetSettingsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new AdminSettings { CommissionPercentage = 50m, FlatCommissionAmount = 200m });

        Payment? captured = null;
        _paymentRepository
            .Setup(r => r.AddAsync(It.IsAny<Payment>(), It.IsAny<CancellationToken>()))
            .Callback<Payment, CancellationToken>((p, _) => captured = p)
            .Returns(Task.CompletedTask);

        var sut = CreateSut();
        await sut.CreateCommissionAsync(admin.Id, new CreatePaymentRequest
        {
            TuitionPostId = post.Id,
            TeacherId = teacher.Id,
            Amount = 1000m
        });

        Assert.Equal(200m, captured!.CommissionAmount);
        Assert.Equal(800m, captured.TeacherNetAmount);
    }

    [Fact]
    public async Task MarkAsPaidAsync_WrongTeacher_ThrowsForbidden()
    {
        var payment = new Payment { Id = Guid.NewGuid(), TeacherId = Guid.NewGuid(), Status = PaymentStatus.Pending };
        _paymentRepository.Setup(r => r.GetByIdAsync(payment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(payment);

        var sut = CreateSut();
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.MarkAsPaidAsync(Guid.NewGuid(), payment.Id, "ref-123"));
    }
}
