using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Payments;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Payments;

public class PaymentService : IPaymentService
{
    private readonly IUserRepository _userRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly IParentProfileRepository _parentProfileRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IAdminSettingsRepository _adminSettingsRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PaymentService(
        IUserRepository userRepository,
        ITuitionPostRepository tuitionPostRepository,
        IParentProfileRepository parentProfileRepository,
        IPaymentRepository paymentRepository,
        IAdminSettingsRepository adminSettingsRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _parentProfileRepository = parentProfileRepository;
        _paymentRepository = paymentRepository;
        _adminSettingsRepository = adminSettingsRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PaymentDto> CreateCommissionAsync(Guid adminUserId, CreatePaymentRequest request, CancellationToken cancellationToken = default)
    {
        var admin = await _userRepository.GetByIdAsync(adminUserId, cancellationToken)
                    ?? throw new NotFoundException("User", adminUserId);
        if (admin.Role != UserRole.Admin)
        {
            throw new ForbiddenException("Only admins can create commission payments.");
        }

        var post = await _tuitionPostRepository.GetByIdAsync(request.TuitionPostId, cancellationToken)
                   ?? throw new NotFoundException("Tuition post", request.TuitionPostId);

        if (post.ParentProfileId is null)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["tuitionPostId"] = new[] { "Tuition post is not associated with a parent." }
            });
        }

        var parentProfile = await _parentProfileRepository.GetByIdAsync(post.ParentProfileId.Value, cancellationToken)
                               ?? throw new NotFoundException("Parent profile", post.ParentProfileId.Value);
        var parentUserId = parentProfile.UserId;

        var teacher = await _userRepository.GetByIdAsync(request.TeacherId, cancellationToken)
                      ?? throw new NotFoundException("Teacher", request.TeacherId);

        var settings = await _adminSettingsRepository.GetSettingsAsync(cancellationToken);

        var commissionAmount = settings.FlatCommissionAmount ?? (request.Amount * settings.CommissionPercentage / 100m);
        var payment = new Payment
        {
            ParentId = parentUserId,
            TeacherId = teacher.Id,
            TuitionPostId = post.Id,
            Amount = request.Amount,
            CommissionAmount = commissionAmount,
            TeacherNetAmount = request.Amount - commissionAmount,
            Status = PaymentStatus.Pending,
            ReferenceNumber = request.ReferenceNumber
        };

        await _paymentRepository.AddAsync(payment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task<PaymentDto> MarkAsPaidAsync(Guid teacherUserId, Guid paymentId, string? reference, CancellationToken cancellationToken = default)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId, cancellationToken)
                       ?? throw new NotFoundException("Payment", paymentId);

        if (payment.TeacherId != teacherUserId)
        {
            throw new ForbiddenException("You are not allowed to update this payment.");
        }

        payment.Status = PaymentStatus.Paid;
        payment.ReferenceNumber = reference ?? payment.ReferenceNumber;

        _paymentRepository.Update(payment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task<IReadOnlyCollection<PaymentDto>> GetTeacherPaymentsAsync(Guid teacherUserId, CancellationToken cancellationToken = default)
    {
        var payments = await _paymentRepository.GetTeacherPaymentsAsync(teacherUserId, cancellationToken);
        return payments.Select(_mapper.Map<PaymentDto>).ToList();
    }

    public async Task<IReadOnlyCollection<PaymentDto>> GetParentPaymentsAsync(Guid parentUserId, CancellationToken cancellationToken = default)
    {
        var payments = await _paymentRepository.GetParentPaymentsAsync(parentUserId, cancellationToken);
        return payments.Select(_mapper.Map<PaymentDto>).ToList();
    }
}

