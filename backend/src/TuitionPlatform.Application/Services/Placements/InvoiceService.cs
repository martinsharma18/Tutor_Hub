using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.Common.Security;
using TuitionPlatform.Application.DTOs.Placements;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Placements;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IPlacementRepository _placementRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly INotificationService _notificationService;
    private readonly IAuditLogService _auditLogService;
    private readonly IUnitOfWork _unitOfWork;

    public InvoiceService(
        IInvoiceRepository invoiceRepository,
        IPlacementRepository placementRepository,
        ITeacherProfileRepository teacherProfileRepository,
        INotificationService notificationService,
        IAuditLogService auditLogService,
        IUnitOfWork unitOfWork)
    {
        _invoiceRepository = invoiceRepository;
        _placementRepository = placementRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _notificationService = notificationService;
        _auditLogService = auditLogService;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> GenerateMonthlyInvoicesAsync(DateOnly periodStart, CancellationToken cancellationToken = default)
    {
        // Normalise to the first of the month so the unique (PlacementId, PeriodStart) index
        // actually catches duplicates regardless of which day the job runs.
        var start = new DateOnly(periodStart.Year, periodStart.Month, 1);
        var end = start.AddMonths(1).AddDays(-1);

        var placements = await _placementRepository.GetActiveForBillingAsync(cancellationToken);
        var created = 0;

        foreach (var placement in placements)
        {
            // Don't bill for months before the tuition began.
            if (placement.StartDate > end)
            {
                continue;
            }

            if (await _invoiceRepository.ExistsForPeriodAsync(placement.Id, start, cancellationToken))
            {
                continue;
            }

            await _invoiceRepository.AddAsync(new Invoice
            {
                PlacementId = placement.Id,
                PeriodStart = start,
                PeriodEnd = end,
                // Snapshotted from the placement so a later fee change doesn't rewrite old invoices.
                AmountDue = placement.MonthlyFee,
                CommissionAmount = placement.CommissionAmount,
                TeacherPayoutAmount = placement.TeacherPayoutAmount,
                Status = InvoiceStatus.Pending
            }, cancellationToken);

            created++;
        }

        if (created > 0)
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return created;
    }

    public async Task<InvoiceDto> MarkParentPaidAsync(Guid adminUserId, Guid invoiceId, MarkInvoicePaidRequest request, CancellationToken cancellationToken = default)
    {
        var invoice = await _invoiceRepository.GetDetailedByIdAsync(invoiceId, cancellationToken)
                      ?? throw new NotFoundException("Invoice", invoiceId);

        if (invoice.Status == InvoiceStatus.Paid)
        {
            throw new BadRequestException("This invoice is already marked paid.");
        }

        invoice.Status = InvoiceStatus.Paid;
        invoice.PaidAtUtc = DateTime.UtcNow;
        invoice.ReferenceNumber = request.ReferenceNumber;

        _invoiceRepository.Update(invoice);
        await _auditLogService.LogAsync(adminUserId, "InvoiceMarkedPaid", nameof(Invoice), invoice.Id,
            $"Amount={invoice.AmountDue}, Ref={request.ReferenceNumber}", cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.NotifyAsync(invoice.Placement.ParentUserId, "InvoicePaid", "Payment received",
            $"Thanks — we've recorded your payment for {invoice.PeriodStart:MMMM yyyy}.",
            "/parent/invoices", cancellationToken);

        return MapToDto(invoice, includeFeeBreakdown: true);
    }

    public async Task<InvoiceDto> MarkTeacherPaidOutAsync(Guid adminUserId, Guid invoiceId, CancellationToken cancellationToken = default)
    {
        var invoice = await _invoiceRepository.GetDetailedByIdAsync(invoiceId, cancellationToken)
                      ?? throw new NotFoundException("Invoice", invoiceId);

        // Paying the teacher before the parent has paid means the platform is out of pocket —
        // block it so it can only ever happen as a deliberate, separate decision.
        if (invoice.Status != InvoiceStatus.Paid)
        {
            throw new BadRequestException("Collect the parent's payment before paying out the teacher.");
        }

        if (invoice.TeacherPaidOutAtUtc.HasValue)
        {
            throw new BadRequestException("The teacher has already been paid for this invoice.");
        }

        invoice.TeacherPaidOutAtUtc = DateTime.UtcNow;
        _invoiceRepository.Update(invoice);

        await _auditLogService.LogAsync(adminUserId, "TeacherPaidOut", nameof(Invoice), invoice.Id,
            $"Payout={invoice.TeacherPayoutAmount}", cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.NotifyAsync(invoice.Placement.TeacherProfile.UserId, "TeacherPaidOut", "Payment sent",
            $"Your payout for {invoice.PeriodStart:MMMM yyyy} has been released.",
            "/teacher/earnings", cancellationToken);

        return MapToDto(invoice, includeFeeBreakdown: true);
    }

    public async Task<PagedResult<InvoiceDto>> GetPagedAsync(string? status, PagedRequest request, CancellationToken cancellationToken = default)
    {
        InvoiceStatus? parsed = Enum.TryParse<InvoiceStatus>(status, true, out var s) ? s : null;
        var (items, total) = await _invoiceRepository.GetPagedAsync(parsed, request.Page, request.PageSize, cancellationToken);

        return new PagedResult<InvoiceDto>
        {
            Items = items.Select(i => MapToDto(i, includeFeeBreakdown: true)).ToList(),
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<IReadOnlyCollection<InvoiceDto>> GetMyInvoicesAsParentAsync(Guid parentUserId, CancellationToken cancellationToken = default)
    {
        var invoices = await _invoiceRepository.GetForParentAsync(parentUserId, cancellationToken);
        return invoices.Select(i => MapToDto(i, includeFeeBreakdown: true)).ToList();
    }

    public async Task<IReadOnlyCollection<InvoiceDto>> GetMyEarningsAsTeacherAsync(Guid teacherUserId, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByUserIdAsync(teacherUserId, cancellationToken)
                      ?? throw new NotFoundException("Teacher profile", teacherUserId);

        var invoices = await _invoiceRepository.GetForTeacherAsync(profile.Id, cancellationToken);
        return invoices
            .Select(i => MapToDto(i, PlacementVisibility.CanTeacherSeeFullFee(i.Placement)))
            .ToList();
    }

    private static InvoiceDto MapToDto(Invoice invoice, bool includeFeeBreakdown) => new()
    {
        Id = invoice.Id,
        PlacementId = invoice.PlacementId,
        Subject = invoice.Placement?.Subject ?? string.Empty,
        ParentName = invoice.Placement?.ParentUser?.FullName ?? "Unknown",
        TeacherName = invoice.Placement?.TeacherProfile?.User?.FullName ?? "Unknown",
        PeriodStart = invoice.PeriodStart,
        PeriodEnd = invoice.PeriodEnd,
        AmountDue = includeFeeBreakdown ? invoice.AmountDue : null,
        CommissionAmount = includeFeeBreakdown ? invoice.CommissionAmount : null,
        TeacherPayoutAmount = invoice.TeacherPayoutAmount,
        Status = invoice.Status.ToString(),
        PaidAtUtc = invoice.PaidAtUtc,
        ReferenceNumber = invoice.ReferenceNumber,
        TeacherPaidOutAtUtc = invoice.TeacherPaidOutAtUtc
    };
}
